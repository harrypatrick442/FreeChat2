/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;


/**
 *
 * @author EngineeringStudent
 */
public class Adverts {

    public static String get()
    {
        switch(Configuration.pageType)
        {
            case Video:
                return "<div id='leftAdverts' style='position:absolute; top:0px; left:0px; width:auto; height:auto;'>"
                        + ""
                        + "<div class=\"alignleft\">\n" +
"     <script type=\"text/javascript\">\n" +
"       	amzn_assoc_ad_type = \"banner\";\n" +
"	amzn_assoc_marketplace = \"amazon\";\n" +
"	amzn_assoc_region = \"US\";\n" +
"	amzn_assoc_placement = \"assoc_banner_placement_default\";\n" +
"	amzn_assoc_campaigns = \"game_downloads\";\n" +
"	amzn_assoc_banner_type = \"category\";\n" +
"	amzn_assoc_p = \"29\";\n" +
"	amzn_assoc_isresponsive = \"false\";\n" +
"	amzn_assoc_banner_id = \"1R7B1N4E97Z234TK4G82\";\n" +
"	amzn_assoc_width = \"120\";\n" +
"	amzn_assoc_height = \"600\";\n" +
"	amzn_assoc_tracking_id = \"grabavid-20\";\n" +
"	amzn_assoc_linkid = \"c7d15d3e2076f02f7037a1e623d24295\";\n" +
"     </script>\n" +
"     <script src=\"//z-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&Operation=GetScript&ID=OneJS&WS=1\"></script>\n" +
"    </div>"
                        + "</div>";
            default:
                return "";
                
        }
    }
}
