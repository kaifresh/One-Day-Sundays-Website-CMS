/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 $(".city-link").click(function(){

    setTextureSlideBackgrounds( $(this).index() ); //THIS GIVES YOU THE nth sibling number
    
    setSiteInfo( $(this).text() );   

    setTicketLink($(this).text() ); 

    dynamicSizing();
});
/*
 * INFO PER MONTH
 * Date + Time
 * Venue + Address
 * 
 * [DJS] - picture, name, bio
 * 
 * Video URL
 * 
 * Outro Text
 */
 var cityInfo = [];
 $.ajax({ url: 'db.php',
    data: { action: 'allinfo' },
    type: 'post',
    success: function(output) {
        cityInfo = JSON.parse( output );
        console.log("Ajaxed City info from DB:", cityInfo);
        setSiteInfo("Sydney");
    }
});


 function setSiteInfo( city ){

    var didSetIntro = false;

    $("#dj-row").empty(); //Clear prev djs

    for (var i = 0; i < cityInfo.length; i++){

        var row = cityInfo[i];

        if ( row.city.toLowerCase() === city.toLowerCase() ){

            if (!didSetIntro){

                var date = moment(row.date, "YYYY-MM-DD");
                date = date.format("MMM Do");
                $("#event-date").text( date );
                $("#venue-name").text( row.venuename );
                $("#venue-address").text( row.address );

                didSetIntro = true;
            }

            makeDJPanel(row);

        }
    }

    /*Should do this regardless and separate venues from dj info*/
    if (!didSetIntro){
        getBackupCityInfo( city );
    }    
}


function makeDJPanel(row){
        // console.log(row);
    //THIS IS WHERE YOU CHOOSE THE SUBDIR TO GET THE PICS FROM (currently edit/dj-imgs/picture.png)
    // src='img/djs/"

    var idString = row.name.replace(" ", "") + "-panel";
    var imgIdString = row.name.replace(" ", "") + "-panel-img";

    var djPanel = "<div id= '" + idString + "'' class='column small-centered text-center dj-info'  data-equalizer-watch>" +                  
    "<img id='" + imgIdString +"' class='dj-img' src='edit/dj-imgs/" + row.imgurl +"' class='thumbnail' alt=''>" +
    "<h4 class='dj-name' class='text-center'>" + row.name +"</h4>"+
    "<p class='dj-detail'>" + row.bio + "</p>"+
    "</div>";

    $("#dj-row").append(djPanel);    

    /*Sizing must be a callback or sizes are based on the page w.o images loaded yets*/
    $("#"+imgIdString).on("load", function() {
      console.log("LOADED!!!!", $(this));
              dynamicSizing(); //Now handle sizing
  });
}

function setTicketLink( city ){

    if (city.toLowerCase() === "sydney"){
        $("#ticket-link-a").text("BUY TICKETS");
        $("#ticket-link-a").attr('href', 'http://tix.onedaysundays.com');
    } else {
        $("#ticket-link-a").text("FREE");
        $("#ticket-link-a").removeAttr('href');
    }

}

/*A custom function for Brisbane or any city with no upcoming O.D.S. -> get venue info from DB*/
var didGetBackupInfo = false;
function getBackupCityInfo(city){
    if (!didGetBackupInfo){
     $.ajax({ url: 'db.php',
        data: { action: 'venuebackupinfo' },
        type: 'post',
        success: function(output) {
            backupCityInfo = JSON.parse( output );
            console.log("BACKUP info: ", backupCityInfo);

            for (var i = backupCityInfo.length - 1; i >= 0; i--) {

                if (backupCityInfo[i].city.toLowerCase() === city.toLowerCase()){
                    $("#venue-name").text( backupCityInfo[i].name.toString() );
                    $("#venue-address").text( backupCityInfo[i].address.toString() );    
                    $("#event-date").text( "T.B.A." );
                    $("#dj-row").append("<h2 style='margin-top:25%'>Artists T.B.A.</h2>");                   
                    break;
                }            
            }
            dynamicSizing();
        }
    });      

     didGetBackupInfo = true;
 }
}



/*SET THE VIDEO
 - Not city related but it is ajax related
 */
 function getVideo(){

    console.log("getVideo()");

    $.ajax({ url: 'db.php',
        data: { action: 'video-get' },
        type: 'post',
        success: function(output) {
            console.log("GOT THE VIDDY", output);
            backupCityInfo = JSON.parse( output );

            $("#video-embed").attr('src', backupCityInfo[0]['url']);
        }
    });
}
getVideo();

