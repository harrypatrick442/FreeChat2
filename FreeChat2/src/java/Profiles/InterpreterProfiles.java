/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Profiles;

import MyWeb.Configuration;
import MyWeb.Interpreter;
import MySocket.AsynchronousSender;
import MyWeb.Database.Database;
import MyWeb.GuarbageWatch;
import MySocket.IGetInterpreter;
import MyWeb.IInterfaces;
import MyWeb.MyConsole;
import MySocket.MySocket;
import MyWeb.TimeOffset;
import MyWeb.Tuple;
import Youtube.InterpreterDownloader;
import java.util.Iterator;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author EngineeringStudent
 */
public class InterpreterProfiles extends Interpreter {

    public AsynchronousSender asynchronousSender;
    private IInterfaces iInterfaces;
    private User user;
    private static long timeOffset = Long.MIN_VALUE;
    private static IDatabase _iDatabase;

    private static IDatabase getIDatabase() {
        if (_iDatabase == null) {
            _iDatabase = new Database();
        }
        return _iDatabase;
    }
    private static IConfigurationPassword _iConfigurationPassword;

    private static IConfigurationPassword getIConfigurationPassword() {
        if (_iConfigurationPassword == null) {
            _iConfigurationPassword = new Configuration();
        }
        return _iConfigurationPassword;
    }

    public InterpreterProfiles(AsynchronousSender asynchronousSender, IInterfaces iInterfaces) {
        GuarbageWatch.add(this);
        this.asynchronousSender = asynchronousSender;
        this.iInterfaces = iInterfaces;
    }

    public void interpret(JSONObject jObject) throws Exception {
        try {
            String type = jObject.getString("type");
            if (type.equals("time_reference")) {
                timeReference();
            } else {
                if (type.equals("set_user_active")) {
                    setUserActive();
                } else {
                    if (type.equals("authenticate")) {
                        authenticate(jObject);
                    } else {
                        if (type.equals("search")) {
                            search(jObject);
                        } else {
                            if (type.equals("get_profile")) {
                                getProfile(jObject);
                            } else {
                                if (type.equals("update_profile")) {
                                    updateProfile(jObject);
                                } else {
                                    if (type.equals("set_location")) {
                                        setLocation(jObject);
                                    } else {
                                        if (type.equals("register")) {
                                            register(jObject);
                                        } else {
                                            if (type.equals("profile_picture")) {
                                                profilePicture(jObject);
                                            } else {
                                                if (type.equals("profile_picture_operation")) {
                                                    profilePictureOperation(jObject);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    private void _authenticate(User user, String username, boolean success, String message) throws JSONException, Exception {
        this.user = user;
        JSONObject jObjectReply = new JSONObject();
        jObjectReply.put("type", "authenticate");
        if (success) {
            jObjectReply.put("username", username);
            jObjectReply.put("userId", user.getUuid().getShortVersion());
        } else {
            jObjectReply.put("reason", message);
        }
        jObjectReply.put("successful", success);
        List<IInterpreterAuthentication> iInterpreterAuthentications = iInterfaces.getAllInterfacesOfType(IInterpreterAuthentication.class);

        for (IInterpreterAuthentication i : iInterpreterAuthentications) {
            i.preSendAuthenticationReply(username, success, user);
        }
        asynchronousSender.send(jObjectReply);
        for (IInterpreterAuthentication i : iInterpreterAuthentications) {
            i.postSendAuthenticationReply(success, jObjectReply);
        }
    }

    private void authenticate(JSONObject jObject) throws Exception {
        if (Configuration.authenticationType.equals(Configuration.AuthenticationType.full)) {
            try {
                String usernameOrEmail = jObject.getString("username");
                String password = jObject.getString("password");
                Result result = AuthenticationHelper.authenticate(usernameOrEmail, password, getIDatabase());
                _authenticate(result.getSuccess() ? ((Tuple<User, String>) result.getPayload()).x : null, result.getSuccess() ? ((Tuple<User, String>) result.getPayload()).y : null, result.getSuccess(), result.getMessage());

            } catch (JSONException ex) {
                throw ex;
            }
        } else {
            if (Configuration.authenticationType.equals(Configuration.AuthenticationType.username)) {
                try {
                    JSONObject jObjectReply = new JSONObject();
                    jObjectReply.put("type", "authenticate");
                    String username = jObject.getString("username");
                    boolean successful = false;
                    String usernameIsValid = UsernameHelper.isValid(username);
                    List<IInterpreterAuthentication> iInterpreterAuthentications = iInterfaces.getAllInterfacesOfType(IInterpreterAuthentication.class);
                    if (username != null && usernameIsValid == null) {
                        jObjectReply.put("username", username);
                        successful = true;
                    } else {
                        jObjectReply.put("reason", usernameIsValid);
                    }
                    for (IInterpreterAuthentication i : iInterpreterAuthentications) {
                        i.preSendAuthenticationReply(username, successful, user);
                    }
                    jObjectReply.put("successful", successful);
                    asynchronousSender.send(jObjectReply);
                    for (IInterpreterAuthentication i : iInterpreterAuthentications) {
                        i.postSendAuthenticationReply(successful, jObjectReply);
                    }
                    if (successful) {
                        MyConsole.out.println("sending uses on username");
                    }
                } catch (JSONException ex) {
                    throw ex;
                }
            }
        }
    }

    private void register(JSONObject jObject) throws Exception {
        String username = jObject.getString("username");
        String password = jObject.getString("password");
        String email = jObject.getString("email");
        JSONObject jObjectBirthday = jObject.getJSONObject("birthday");
        int day = jObjectBirthday.getInt("day");
        int month = jObjectBirthday.getInt("month");
        int year = jObjectBirthday.getInt("year");
        JSONObject jObjectReply = new JSONObject();
        jObjectReply.put("type", "register");
        Result result = RegistrationHelper.register(username, email, password, day, month, year, getIDatabase(), getIConfigurationPassword());
        jObjectReply.put("successful", result.getSuccess());
        if (!result.getSuccess()) {
            jObjectReply.put("reason", result.getMessage());
        }
        asynchronousSender.send(jObjectReply);
        if (result.getSuccess()) {
            _authenticate((User) result.getPayload(), username, true, null);
        }

    }

    private void timeReference() throws JSONException {
        long millis = System.currentTimeMillis() - TimeOffset.get();
        JSONObject jObjectReply = new JSONObject("{type:time_reference, reference:" + millis + "}");
        asynchronousSender.send(jObjectReply);
    }

    private void setUserActive() {
        long millis = System.currentTimeMillis() - TimeOffset.get();
        MyConsole.out.println(millis);
        if (Configuration.authenticationType.equals(Configuration.AuthenticationType.full)) {
            try {
                if (user != null) {
                    getIDatabase().getUuidToLastActive().set(user.getUuid(), millis);
                }
                for (IInterpreterLastActive i : iInterfaces.getAllInterfacesOfType(IInterpreterLastActive.class)) {
                    i.sendActive();
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    public void search(JSONObject jObject) throws Exception {
        if (user != null) {
            JSONObject jObjectValues = jObject.getJSONObject("values");
            JSONObject jObjectReply = getIDatabase().getProfiles().get(user.getUuid(), jObjectValues);
            jObjectReply.put("type", "search");
            if (jObjectReply != null) {
                MyConsole.out.println(jObjectReply.toString());
                asynchronousSender.send(jObjectReply);
                return;
            }
        }
    }

    public void getProfile(JSONObject jObject) throws Exception {
        String userId = jObject.getString("userId");
        JSONObject jObjectReply = getIDatabase().getProfiles().get(userId);
        jObjectReply.put("type", "get_profile");
        jObjectReply.put("userId", userId);
        if (jObjectReply != null) {
            MyConsole.out.println(jObjectReply.toString());
            asynchronousSender.send(jObjectReply);
            return;
        }
    }

    public void updateProfile(JSONObject jObject) throws JSONException, Exception {
        if (user != null) {
            JSONObject jObjectValues = jObject.getJSONObject("values");
            Iterator<String> iterator = jObjectValues.keys();
            while (iterator.hasNext()) {
                try {
                    String type = iterator.next();
                    if (type.equals("about")) {
                        getIDatabase().getUuidToAbout().addOrReplace(user.getUuid(), jObjectValues.getString(type));
                    } else {
                        if (type.equals("status")) {
                            getIDatabase().getUuidToStatus().addOrReplace(user.getUuid(), jObjectValues.getString(type));
                        } else {
                            if (type.equals("interests")) {
                                getIDatabase().getUuidToInterests().set(user.getUuid(), jObjectValues.getJSONObject(type));
                            } else {
                                if (type.equals("ethnicity")) {
                                }
                            }
                        }
                    }
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        }
    }

    private void setLocation(JSONObject jObject) throws JSONException, Exception {
        if (user != null) {
            JSONObject jObjectLevelQuadNs = jObject.getJSONObject("levelQuadNs");
            getIDatabase().getUuidToLocation().set(user.getUuid(), jObject.getString("formattedAddress"), jObjectLevelQuadNs.getInt("5"), jObjectLevelQuadNs.getInt("6"), jObjectLevelQuadNs.getInt("7"), jObjectLevelQuadNs.getInt("8"), jObjectLevelQuadNs.getInt("9"), jObjectLevelQuadNs.getInt("10"), jObjectLevelQuadNs.getInt("11"), jObjectLevelQuadNs.getInt("12"), jObjectLevelQuadNs.getInt("13"), jObjectLevelQuadNs.getInt("14"), jObjectLevelQuadNs.getLong("15"), jObjectLevelQuadNs.getLong("16"), jObjectLevelQuadNs.getLong("17"), jObjectLevelQuadNs.getLong("18"));
        }
    }

    private void profilePicture(JSONObject jObject) throws Exception {
        JSONObject jObjectReplyImageUploader = new JSONObject();
        jObjectReplyImageUploader.put("type", "image_uploader_reply");
        if (user != null) {
            try {
                Result<String> result = Pictures.Save(jObject);
                if (result.getSuccess()) {
                    getIDatabase().getUuidToImages().add(user.getUuid(), result.getPayload());
                    jObjectReplyImageUploader.put("successful", true);
                    JSONObject jObjectProfilePictureAdd = new JSONObject();
                    jObjectProfilePictureAdd.put("type", "profile_picture_add");
                    JSONObject jObjectPicture = new JSONObject();
                    jObjectPicture.put("relativePath", result.getPayload());
                    jObjectProfilePictureAdd.put("picture", jObjectPicture);
                    asynchronousSender.send(jObjectProfilePictureAdd);
                } else {
                    jObjectReplyImageUploader.put("reason", result.getMessage());
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        } else {
            jObjectReplyImageUploader.put("reason", "You must sign in!");
        }
        jObjectReplyImageUploader.put("successful", true);
        asynchronousSender.send(jObjectReplyImageUploader);
    }

    private void profilePictureOperation(JSONObject jObject) throws Exception {
        if (user != null) {
            JSONObject operation = jObject.getJSONObject("operation");
            String type = operation.getString("type");
            String relativePath = operation.getString("relativePath");
            MyConsole.out.println(type);
            if (type.equals("shift_left")) {
                getIDatabase().getUuidToImages().shiftLeft(user.getUuid(), relativePath);
            } else {
                if (type.equals("shift_right")) {
                    getIDatabase().getUuidToImages().shiftRight(user.getUuid(), relativePath);
                } else {
                    if (type.equals("delete")) {
                        getIDatabase().getUuidToImages().delete(user.getUuid(), relativePath);
                    } else {
                        if (type.equals("set_not_profile")) {
                            getIDatabase().getUuidToImages().setProfile(user.getUuid(), relativePath, false);
                        } else {
                            if (type.equals("set_profile")) {
                                getIDatabase().getUuidToImages().setProfile(user.getUuid(), relativePath, true);
                            }
                        }
                    }
                }
            }
        }
    }

    @Override
    public void close() {
    
    }
}