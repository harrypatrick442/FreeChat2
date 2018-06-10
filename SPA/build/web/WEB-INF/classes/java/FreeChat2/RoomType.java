/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package FreeChat2;

public enum RoomType {

    Text("text"), PM("pm"), VideoPM("video_pm"), Video("video");
    private final String name;
    private RoomType(String s) {
        name = s;
    }
    public String toString() {
        return name;
    }
    public static RoomType fromString(String str){
            if(str.equals("pm"))
                return RoomType.PM;
            if(str.equals("video_pm"))
                return RoomType.VideoPM;
            if(str.equals("video"))
                return RoomType.Video;
            return RoomType.Text;
    }
};
