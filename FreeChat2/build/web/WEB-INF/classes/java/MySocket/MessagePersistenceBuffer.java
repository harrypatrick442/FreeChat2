/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MySocket;

import MyWeb.GuarbageWatch;
import MyWeb.IClose;
import MyWeb.InterfaceLooper;
import MyWeb.SixSecondLooper;
import MyWeb.MyConsole;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author SoftwareEngineer7
 */
public class MessagePersistenceBuffer implements ISend, ISendUnsynched, IGot , IClose{

    private ISend iSend;
    private volatile FutureConfirmeds futureConfirmeds = new FutureConfirmeds();
    private volatile MessageBuffer messageBuffer;
    private volatile ReceivedHandler receivedHandler;
    private volatile long counterConfirmed = -1;
    private volatile long counter = 0;
    public volatile Map<Long, JSONObject> currentBuffer = new HashMap<Long, JSONObject>();
    private final int MAX_BUFFER = 20;
    private WatchDog watchDog = new WatchDog();

    public MessagePersistenceBuffer(ISend iSend, IGot iGot) {
        this.iSend = iSend;
        this.messageBuffer = new MessageBuffer(this);
        receivedHandler = new ReceivedHandler(iGot);
            GuarbageWatch.add(this);
    }

    private void addToCurrentBuffer(JSONObject jObject, long nMessage) {
        synchronized (currentBuffer) {
            currentBuffer.put(nMessage, jObject);
        }
    }

    private void addToCurrentBuffer(List<JSONObject> jObjects, long startCount) {
        synchronized (currentBuffer) {
            for (JSONObject jObject : jObjects) {
                currentBuffer.put(startCount++, jObject);
            }
        }
    }

    private void removeRangeFromCurrentBuffer(long from, long toInclusive) {
        long i = from;
        while (i <= toInclusive) {
            if (currentBuffer.containsKey(i)) {
                currentBuffer.remove(i);
            }
            i++;
        }

    }

    private void writeException(Object o) {

    }

    private void resend(List<Long> list) {
        //synchronized (currentBuffer) {
        long length = list.size();
        for (int i = 0; i < length; i++) {
            long nMessage = list.get(i);
            if (currentBuffer.containsKey(nMessage)) {
                iSend.send(currentBuffer.get(nMessage));
            } else {
                MyConsole.out.println("ERROR" + nMessage);
                sendSkip(nMessage);
                writeException(new DroppedMessageException("A message appears to have been dropped :(! This should never happen"));
                //tell client to skip.
            }
        }
        //}
    }

    private void sendSkip(long nMessage) {
        JSONObject jObject = new JSONObject();
        try {
            jObject.put("type", "skip");
            jObject.put("nMessage", nMessage);
            iSend.send(jObject);
        } catch (JSONException ex) {

        }
    }

    private void fillCurrentBufferUnsynched() {
        messageBuffer.getMessages(MAX_BUFFER - (futureConfirmeds.size() + currentBuffer.size()));
    }

    private void fillCurrentBuffer() {
        synchronized (currentBuffer) {
            fillCurrentBufferUnsynched();
        }
    }

    private void confirmSent(long from, long toInclusive) {

        synchronized (currentBuffer) {
            if (from <= counterConfirmed + 1) {
                if (toInclusive >= counterConfirmed + 1) {
                    removeRangeFromCurrentBuffer(counterConfirmed + 1, toInclusive);
                    counterConfirmed = futureConfirmeds.forwardToInclusive(toInclusive);
                    futureConfirmeds.progressStart(counterConfirmed);
                    fillCurrentBufferUnsynched();
                }
            } else {
                futureConfirmeds.addRange(from, toInclusive);
                removeRangeFromCurrentBuffer(from, toInclusive);
                if (counterConfirmed + 1 < counter) {
                    resend(futureConfirmeds.getUnconfirmedInRange(counterConfirmed + 1, from - 1));
                }
            }
        }
    }

    private void sendConfirmation(long nMessage) {
        sendConfirmation(nMessage, nMessage);
    }

    private void sendConfirmation(long from, long toInclusive) {
        try {
            JSONObject jObjectConfirmation = new JSONObject();
            jObjectConfirmation.put("type", "confirmation");
            jObjectConfirmation.put("from", from);
            jObjectConfirmation.put("to", toInclusive);
            iSend.send(jObjectConfirmation);
        } catch (JSONException ex) {

            ex.printStackTrace();
        }

    }

    @Override
    public void send(JSONObject jObject) {
        //  JSONObject jObject 
        if (jObject != null) {
            messageBuffer.send(jObject);
            fillCurrentBuffer();
            watchDog.reset();
        }
    }

    @Override
    public void send(List<JSONObject> jObjects) {
        if (jObjects != null) {
            messageBuffer.send(jObjects);
            fillCurrentBuffer();
            watchDog.reset();
        }
    }
//XXX check jso catches and done prop erl

    @Override
    public void sendUnsynched(JSONObject jObject) {
        if (jObject != null) {
            try {
                //moment new message enters currentBuffer it is sent
                JSONObject jObjectWrapped = new JSONObject();
                jObjectWrapped.put("type", "content");
                jObjectWrapped.put("content", jObject);
                jObjectWrapped.put("nMessage", counter);
                addToCurrentBuffer(jObjectWrapped, counter++);
                iSend.send(jObjectWrapped);
            } catch (JSONException ex) {
                ex.printStackTrace();
            }
        }
    }

    @Override
    public void sendUnsynched(List<JSONObject> jObjects) {
        if (jObjects != null) {
            List<JSONObject> jObjectsWrapped = new ArrayList<JSONObject>();
            long startCount = counter;
            for (JSONObject jObject : jObjects) {
                JSONObject jObjectWrapped = new JSONObject();
                try {
                    jObjectWrapped.put("type", "content");
                    jObjectWrapped.put("content", jObject);
                    jObjectWrapped.put("nMessage", counter++);
                    jObjectsWrapped.add(jObjectWrapped);

                } catch (JSONException ex) {

                }
            }
            addToCurrentBuffer(jObjectsWrapped, startCount);
            iSend.send(jObjectsWrapped);
        }
    }

    private void _got(JSONObject jObject) {
        try {
            String type = jObject.getString("type");
            if (type.equals("confirmation")) {
                confirmSent(jObject.getLong("from"), jObject.getLong("to"));
            } else {
                if (type.equals("content")) {
                    long nMessage = jObject.getLong("nMessage");
                    sendConfirmation(nMessage);
                    MyConsole.out.println(jObject.toString());
                    receivedHandler.add(jObject.getJSONObject("content"), nMessage);
                } else {
                    if (type.equals("skip")) {
                        long nMessage = jObject.getLong("nMessage");
                        sendConfirmation(nMessage);
                        receivedHandler.skip(nMessage);
                    }
                }
            }
        } catch (JSONException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public void got(JSONObject jObject) {
        if (jObject != null) {
            watchDog.reset();
            _got(jObject);
        }
    }

    @Override
    public void got(List<JSONObject> jObjects) {
        if (jObjects != null) {
            for (JSONObject jObject : jObjects) {
                _got(jObject);
            }
        }
    }

    @Override
    public void close() {
        watchDog.close();
    }

    public static class DroppedMessageException extends Exception {

        public DroppedMessageException() {
            super();
        }

        public DroppedMessageException(String message) {
            super(message);
        }
    }

    private class FutureConfirmeds {

        private volatile long countConfirmed = -1;
        private volatile List<Long> list = new ArrayList<Long>();

        public void progressStart(long to) {
            while (countConfirmed < to) {
                list.remove(new Long(++countConfirmed));
            }
        }

        public long forwardToInclusive(long toInclusive) {
            long i = toInclusive + 1;
            while (list.contains(i)) {
                i++;
            }
            return i - 1;
        }

        public void addRange(long from, long toInclusive) {
            for (long i = (from < countConfirmed + 1 ? countConfirmed + 1 : from); i <= toInclusive; i++) {
                if (!list.contains(i)) {
                    list.add(i);
                }
            }
        }

        public List<Long> getUnconfirmedInRange(long from, long toInclusive) {
            List<Long> list = new ArrayList<Long>();
            for (long i = (from < countConfirmed + 1 ? countConfirmed + 1 : from); i <= toInclusive; i++) {

                if (!this.list.contains(i)) {
                    list.add(i);
                }
            }
            return list;
        }

        public int size() {
            return list.size();
        }
    }

    private class WatchDog  implements IClose, InterfaceLooper {

        private boolean reset = true;
        private boolean removed = false;

        public WatchDog() {
            SixSecondLooper.add(this);
        }

        public void reset() {
            reset = false;
            if (removed) {
                SixSecondLooper.add(this);
                removed = false;
            }
        }

        @Override
        public void run(AtomicBoolean remove) {
            if (!reset) {
                synchronized (currentBuffer) {
                    if (currentBuffer.size() > 0) {
                        MyConsole.out.println("running_.");
                        resend(futureConfirmeds.getUnconfirmedInRange(counterConfirmed + 1, counter - 1));

                    } else {
                        remove.set(true);
                        removed = true;
                    }

                }
            }
        }

        @Override
        public void close() {
            if(!removed)
                SixSecondLooper.remove(this);
        }
    }

    private class ReceivedHandler{

        private volatile Map<Long, JSONObject> map = new HashMap<Long, JSONObject>();
        private volatile long count = 0;
        private IGot iGot;

        public ReceivedHandler(IGot iGot) {
            this.iGot = iGot;
        }

        public void add(JSONObject jObject, long nMessage) {
            synchronized (map) {
                if (nMessage >= count) {
                    if (map.get(nMessage) == null) {
                        map.put(nMessage, jObject);
                        attemptOutput();
                    }
                }
            }
        }

        public void skip(long nMessage) {
            synchronized (map) {
                JSONObject jObject = new JSONObject();
                try {
                    jObject.put("skip", true);
                } catch (JSONException ex) {
                }

                //THIS IS EMERGENCY ONLY
                map.put(nMessage, jObject);
            }
        }

        private void attemptOutput() {

            long i = count;
            while (true) {
                JSONObject jObject = map.get(i);
                if (jObject == null) {
                    break;
                }
                Boolean skip = null;
                try {
                    skip = jObject.getBoolean("skip");
                    for (int j = 0; j < 100; j++) {
                        MyConsole.out.println("had to skip a message! ERROR");
                    }
                } catch (JSONException ex) {
                    //NORMAL NOT EMERGENCY
                    //THEORETICALLY THIS SHOULD NEVER EVER HAPPEN
                }
                if (skip == null) {
                    iGot.got(jObject);
                }
                map.remove(i);
                i++;
            }
            count = i;
        }
    }

}