/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.

 */    
dynamicSizing();

$(window).load(function(){
    dynamicSizing();
});

$(window).resize(function(){
    dynamicSizing();
});

function dynamicSizing(){
    matchInfoHeight();
    sizeTextureBGs( );
    sizeBGPics();

    setVideoSize();
    centerInfoText();
    positionTicketLink();
}

/***********************************************************************
 * GUARANTEEING THE INFO IS DISPLAYED AT EQUAL HEIGHTS ON THE FIRST SLIDE
 * **********************************************************************/
function matchInfoHeight(){
    
    /*Reset padding*/
    $("#info-date").css("padding-top", "0px");
    $("#info-date").css("padding-bottom", "0px");
    $("#info-venue").css("padding-top", "0px");
    $("#info-venue").css("padding-bottom", "0px");
    
    /*Assign the appropriate one*/
    var smaller = parseInt($("#info-venue").css("height")) < parseInt($("#info-date").css("height")) ? $("#info-venue") : $("#info-date");
    var larger = parseInt($("#info-venue").css("height")) > parseInt($("#info-date").css("height")) ? $("#info-venue") : $("#info-date");    
    
    /*Give padding to the larger one*/
    larger.css("padding-top", "3vh");
    larger.css("padding-bottom", "3vh");
    
    /*Compensate for the smaller one*/    
    var heightDiff = larger.innerHeight() - smaller.innerHeight();     /*Padding but not border - https://api.jquery.com/innerHeight/   PIXELS*/
    heightDiff /= 2;                                                    //Split for top and bottom        
    heightDiff += "px";                                                 //Convert to pixels & a string
    
    /*FINALLY SET THE CORRECTED VALUES*/
    smaller.css("padding-top", heightDiff);
    smaller.css("padding-bottom", heightDiff);    
        
    return larger.innerHeight(); //This is the height of each one -> use it to get the ticket link position.
} 


var animTime = 150;
/*Backgrounds are child images, not css background-image so these make it behave that way.*/
function sizeBGPics(){

    $(".bg-img").each(function(){ 

        // console.log("BEFORE ", $(this)[0]['id'] ,"height", $(this).height(), "...", $(this).parent[0]['id']," height:>", $(this).parent().height());

        var targetHeight = $(this).parent().height();    //$(this).parent().height()         
        $(this).height( targetHeight * 1.1 ); //This is important

        // console.log("AFTER .bg-img height", $(this).height(), "parent height:>", $(this).parent().height());
        // console.log("*******\n");
    }); 
}

function sizeTextureBGs(animate){        
    $(".slide-bg-texture").each(function(){        
        $(this).height( $(this).parent().height() );             
    });    
}

function sizeDJPics(){
    $(".dj-img").each(function(){
        // $(this).width( ($(this).height() * 2)  + "px" );
        // $(this).css('border', 'red 2px solid');
    });
}


function positionTicketLink(){
    if ($("#ticket-link").offset().top / $(window).height() < 0.8){ //Arbitrary ratio that look good for the BG
        $("#ticket-link").css("margin-top", "9vh");
    } else {
        $("#ticket-link").css("margin-top", "5vh"); //Whats in origin css
    }
}


function centerInfoText(){    
    var posInWindow = $("#slide-info-text").offset().top - $(window).scrollTop();
    var midPoint = posInWindow + ($("#slide-info-text").innerHeight()/2);
    var pageMid = $(window).height()/2;
    
    var distance = pageMid - midPoint;
    
    var newY = $("#slide-info-text").offset().top + distance;     
}

function setVideoSize(){
    var w = $(window).innerWidth();
    var scaleFactor = 3;
    if (w < 1000){
        scaleFactor = 1.5;
    } else if (w < 1500){
        scaleFactor = 2;
    }
    
    var vidW = w/scaleFactor;
    var vidH = (vidW/16) * 9;
    
    $("#video-embed").width(vidW);
    $("#video-embed").height(vidH);    
}

/*******SCROLL HINT & disable x scroll******/
var showHint = true;
$(document).scroll(function(){    
    if (showHint){
        offset = $(this).scrollTop();
        if (offset > 100) {  
            $(".scroll-hint").fadeOut(700);
            showHint = false;
        }  
    }          
});