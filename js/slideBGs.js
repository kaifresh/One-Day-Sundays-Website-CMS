/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

setTextureSlideBackgrounds(0);

function setTextureSlideBackgrounds(offset){

    offset = offset === undefined ? 0 : offset; //TYPE CHECK
    offset = parseInt(offset);
    
    var hueOffsets = [0, 180, 55, 245]; //Red green yellow blue
    var brightnessBoost = [120, 120, 120, 120];

    $(".slide-bg-texture").each(function(index, element){
        
        // clearInterval(loopID); //Clear regardless
       
        //Calcualte idx & get values
        var idx = (index + offset) % hueOffsets.length;        
        var hue = hueOffsets[idx];
        var brightness = brightnessBoost[idx];
        
        /*Try extracting the current hue rotation value*/
        var cssString = "none"; 

        if ( $(this).css("-webkit-filter") !== "none" ){
            cssString = $(this).css("-webkit-filter");
        } else if ( $(this).css("filter") !== "none" ){
            cssString = $(this).css("filter");
        } else if ( $(this).css("-moz-filter") !== "none" ){
            cssString = $(this).css("-moz-filter");
        }
        
        if (cssString !== "none" && cssString !== undefined){
            
            /*Search in string for degree value and convert to int*/
            var startPos = cssString.indexOf("(");            
            var endPos = cssString.indexOf("deg");            
            var value = cssString.substring(startPos+1, endPos);                        
            value = parseInt(value);

            /*Closures and this dotn play nice*/
            var tempThis = $(this);
            
            /*Every iteration advance the colour by 1*/
            var loopID = setInterval(function(){
                 
                 // console.log(tempThis.css('-webkit-filter'), '*at*', value % 360, '#aiming for#:', hue);   

                if (value % 360 !== hue){
                    
                    value++;// = value < hue ? value+1 : value-1; //Go the right way -> ALWAYS GO UP

                    tempThis.css("-webkit-filter", "hue-rotate("+value+"deg) brightness("+brightness+"%)");
                    tempThis.css("-moz-filter", "hue-rotate("+value+"deg) brightness("+brightness+"%)");        
                    tempThis.css("filter", "hue-rotate("+value+"deg) brightness("+brightness+"%)");   
                    
                    
                } else {
                    // console.log("CLEAR")
                    clearInterval(loopID);
                }
                
            }, 15);            
            
        } else {
            $(this).css("-webkit-filter", "hue-rotate("+hue+"deg) brightness("+brightness+"%)");
            $(this).css("-moz-filter", "hue-rotate("+hue+"deg) brightness("+brightness+"%)");        
            $(this).css("filter", "hue-rotate("+hue+"deg) brightness("+brightness+"%)");                    
        }
        
       
        

        
    });

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

getAlbums("#slide-djs-background");
getAlbums("#slide-info-background");

/*Cant return values if you want async .... LAME */
function getAlbums(selector){    
    console.log("Get albums for", selector);
    
    $.ajax({
        url: "https://graph.facebook.com/v2.5/onedayers/albums?access_token=967443143267915|d85df264549675f37f59a5d165159eb2",//Could hide behind PHP
        data: [],
        success: function(data, textStatus, jqXHR){

            var albums = data.data;
            
            var randIdx = randomIntFromInterval(0, albums.length-1);
//            console.log("Chose album: ", albums[randIdx], " out of ", albums.length);            
                        
            if (albums[randIdx].name !== "Profile Pictures" && albums[randIdx].name !== "Timeline Photos" && albums[randIdx].name !== "Cover Photos"){ //Swerve profile pics
                var albumID = albums[randIdx].id;
                getPhotos(albumID, selector);
            } else {
                getAlbums(selector);
            }
            
        },
        dataType: "json"
    });    
}

function getPhotos(albumID, selector){    
    $.ajax({
        url: "https://graph.facebook.com/v2.5/" + albumID + "/photos?access_token=967443143267915|d85df264549675f37f59a5d165159eb2",
        data: [],
        success: function(data, textStatus, jqXHR){
            var albumPhotos = data.data;
            var randIdx = randomIntFromInterval(0, albumPhotos.length-1);
            getPhoto(albumPhotos[randIdx].id, selector);            
        },
        dataType: "json"
    });
}

function getPhoto(photoID, selector){
    $.ajax({
        url: "https://graph.facebook.com/v2.5/" + photoID + "?access_token=967443143267915|d85df264549675f37f59a5d165159eb2&fields=images",
        data: [],
        success: function(data, textStatus, jqXHR){
            var picture = data.images[0];             
            $(selector).css('background', 'url(' + picture.source + ')  no-repeat center center fixed'); //Fixed gives par
            $(selector).css({'background-size': 'cover'});
            // $(selector).css({'position': 'static'}); //FOR CHROME ON WINDOWS???
        },
        dataType: "json"
    });
}

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}


