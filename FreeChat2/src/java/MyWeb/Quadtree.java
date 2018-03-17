package MyWeb;

import org.json.JSONException;
import org.json.JSONObject;

public class Quadtree {

    public static class LatLng {

        public double lat;
        public double lng;

        public LatLng(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    public static class Entry {

        public Entry[] constituentEntries;
        public int level;
        public LatLng latLng;
        public Entry(double leftLng, double rightLng, double topLat, double bottomLat, int level, int nLevels) {
            double middleLat = (topLat + bottomLat) / 2;
            double middleLng = (leftLng + rightLng) / 2;
            int newLevel = level + 1;
            latLng = new LatLng(middleLat, middleLng);
            this.level=level;
            if(level<nLevels)
            constituentEntries = new Entry[]{
                new Entry(leftLng, middleLng, topLat, middleLat, newLevel, nLevels),
                new Entry(middleLng, rightLng, middleLat, bottomLat, newLevel, nLevels),
                new Entry(leftLng, middleLng, middleLat, bottomLat, newLevel, nLevels),
                new Entry(middleLng, rightLng, topLat, middleLat, newLevel, nLevels)
            };
        }
        public JSONObject getJSONObject() throws JSONException
        {
            JSONObject jObject = new JSONObject();
            jObject.put("level","level_"+level);
            return jObject;
        }
    }
    //table profileid   level0, level1, level2......
    public static Entry generate()
    {
        int earthRadiusKm = 6371;
        int levels = (int)Math.ceil(Math.log(earthRadiusKm / 0.5)/Math.log(2));//16
        return new Entry((double)-180,(double) 180,(double) 90, (double)-90, 0, levels);
    }
}
