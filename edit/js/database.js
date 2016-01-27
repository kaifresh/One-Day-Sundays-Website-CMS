console.log("DATABASE MYAN");

//FIRST TIME LOADING OF SHIT
refreshEvents();
$(window).load(function(){
    refreshDjs();
});


/*The calls to refresh the table occur here, and not in index.html. Is this violation of MVC. Yes
    However, becasue its all async, putting the table refreshes in the callbacks is infinietely easier...
    */
    console.log("THREE  ISSUES:\n 1. The handling of the disappearing shit isnt working properly.\n 2. Bigger issue - display is always true. \n 3. Double check that this is not actually because of display true not working with the SQL query");

/*DJS  - CRUD
1. Create/Create 
2. Read/Get
3. Update/Edit
4. Delete/Delete
*/
//C
function createNewDJ(name, bio, imgurl){

	console.log("MAKING A DJ!!");
  $.ajax({ url: 'db-edit.php',
    data: { action: 'dj-create', name: name.toString(), bio: bio.toString(), imgurl: imgurl.toString() },
    type: 'post',
    success: function(output) {
       console.log("createNewDJ() raw output:", output);
       createdDJINFO = JSON.parse( output );
            // console.log("DJ made: got this info", createdDJINFO);
            refreshDjs();//now refresh the table
        }
    });
}

//R1
function getCurrentDjs(){
   $.ajax({ url: 'db-edit.php',
    data: { action: 'dj-get'},

    type: 'post',
    success: function(output) {
        console.log("getCurrentDjs() raw output:", output);
        allDJInfo = JSON.parse( output );
            // console.log("ALL DJs:", allDJInfo);
            populateDJTable(allDJInfo);
        }

    });
}

/*R2 array of dictionaries*/
function populateDJTable(djInfo){

    $("#dj-rows").empty();

    for (var i = djInfo.length - 1; i >= 0; i--) {        
        var domString = '<tr class="tr-clickable-dj">' +
        '<td class="dj-name">' + djInfo[i].name + '</td>' +
        '<td class="dj-bio">' + djInfo[i].bio + '</td>' +
        '<td class="dj-img-url">' + djInfo[i].imgurl + '</td>' +
        '<td class="dj-id">' + djInfo[i].id + '</td>'+
        '<td class="dj-edit"><button class="button secondary round">Edit DJ</button></td>' +
        '</tr> '; 

        $("#dj-rows").append(domString);
    };

    /*If you make a change to the table while you were 
    editing an event stored in the database,  restore those choices */
    var curEventId = parseInt($("#event-create-edit-id").text());
    if (curEventId !== -1){
        getDjsForEvent(curEventId);
    }

    setupDJSearch();
    // 

}

/*3. UPDATE*/
function updateDJ(name, bio, imgurl, id){

    console.log("UPdating A DJ!!");
    $.ajax({ url: 'db-edit.php',
        data: { action: 'dj-update', name: name.toString(), bio: bio.toString(), imgurl: imgurl.toString(), id: id.toString() },
        type: 'post',
        success: function(output) {
            console.log("updateDJ() raw output:", output);
            updatedDJINFO = JSON.parse( output );
                // console.log("DJ updated: got this info", updatedDJINFO);
                refreshDjs();//now refresh the table
            }
        });

}

function deleteDJ(id, imgurl){

    console.log("Deleting A DJ!!");
    $.ajax({ url: 'db-edit.php',
        data: { action: 'dj-delete', id: id.toString(), imgurl: imgurl.toString() },
        type: 'post',
        success: function(output) {
            console.log("deleteDJ() raw output:", output);
                // deletedDJINFO = JSON.parse( output );
                // console.log("DJ DEAD TO THE GAME: got this info", deletedDJINFO);
                refreshDjs();//now refresh the table
            }
        });

}







/*events  - CRUD
1. Create/Create  X -
2. Read/Get X
3. Update/Edit
4. Delete/Delete
*/
//1 CReate
function createEvent(cityName, date, display, djs){

    console.log("Creating an event");
    $.ajax({ url: 'db-edit.php',
        data: { action: 'event-create', name: cityName.toString(), date: date.toString(), display: display.toString(), djs: JSON.stringify(djs)},
        type: 'post',
        success: function(output) {
            console.log("createEvent() get an ID back", output);
            createdEventINFO = JSON.parse( output );
            // console.log("Created A new Event WITH OUTPUT -->", createdEventINFO);
            var eventId = createdEventINFO[0]['id'];
            insertEventDjs(eventId,  djs);

            refreshEvents(); //Refereshes the events table  
        }
    });
}
//Second step in creation process
function insertEventDjs(eventId, djIds){
    console.log("event:", eventId, "Put these djs in", djIds);

    $.ajax({ url: 'db-edit.php',
        data: { action: 'event-djs-create', eventId: eventId.toString(), djs: JSON.stringify(djIds)},
        type: 'post',
        success: function(output) {

            console.log("insertEventDjs(). output: ", output);

            // createdEventINFO = JSON.parse( output );
        }
    });
}

//2. READ / GET
function getEvents(){
    $.ajax({ url: 'db-edit.php',
        data: { action: 'event-get'},
        type: 'post',
        success: function(output) {
            console.log("getEvents() raw output:", output);
            getEventINFO = JSON.parse( output );
            // console.log("Go these events", getEventINFO);
            populateEventTable(getEventINFO);
        }
    });
}



function populateEventTable(eventArray){

    console.log("Re-populating the event table!");

    $("#event-rows").empty();

    for (var i = eventArray.length - 1; i >= 0; i--) {   

        console.log("Event (", eventArray[i].city, " / ", eventArray[i].date, ") -- Display:", eventArray[i].display );
        var boolToLayman = eventArray[i].display === "t" ? "Yes" : "No"; //'t' is how the shit thing sets it

        var domString =  '<tr class="tr-clickable-event">'+
        '<td class="event-city">' + eventArray[i].city + '</td>'+
        '<td class="event-date">' + eventArray[i].date + '</td>'+
        '<td class="event-display">' + boolToLayman + '</td>'+
        '<td class="event-id">' + eventArray[i].id + '</td>'+
        '<td class="event-edit"><button class="button secondary round">Edit Event</button></td>'+
        '</tr>'; 

        $("#event-rows").append(domString);
    };

    setupEventSearch(); //Allows for regex search of teh table
}

//A second getter that looks at the djsforevent join table
function getDjsForEvent(eventId){

    $("#spinner-wrap").fadeIn();

    $.ajax({ url: 'db-edit.php',
        data: { action: 'event-get-djs', id: eventId.toString() },
        type: 'post',
        success: function(output) {
            console.log("djs for event() raw output:", output);
            djsForevent = JSON.parse( output );
            // console.log("These djs at event", djsForevent);  
            highLightPlayingDjs(djsForevent);          

            $("#spinner-wrap").fadeOut(800);
        }
    });
}
function highLightPlayingDjs(djsForevent){
// console.log("THIS", djsForevent);
$(".tr-clickable-dj").each(function(){

 for (var i = djsForevent.length - 1; i >= 0; i--) {
    if (djsForevent[i].id.toString() === $(this).children(".dj-id").text()){
        $(this).addClass("dj-selected");
        break;
    }
};

});


}

//3. UPdate
function updateEvent(cityName, date, display, djs, id){

/*3 Steps:
    1. Update teh main data for the event (UPDATE & re-GET)
    2. Delete all djs for that event-id(DELETE)
    3. Re-add djs (could be quicker but nah) (re-CREATE)
    */

    console.log("UPDATING an event");
    /*Can simultaneously delete djs for an event while updating it*/
    $.ajax({ url: 'db-edit.php',
        data: { action: 'event-update', name: cityName.toString(), date: date.toString(), display: display.toString(), id: id.toString()},
        type: 'post',
        success: function(output) {
            // console.log("updated an event ", output);
            updatedEventInfo = JSON.parse( output );
            refreshEvents(); 
            // console.log("Updated an event with JSON output:", updatedEventInfo);
        }
    });
    /*Delete the djs then re-add them on completion*/
    $.ajax({ url: 'db-edit.php',
        data: { action: 'event-djs-delete', eventId: id.toString()},
        type: 'post',
        success: function(output) {
            // console.log("Deleted all the DJS for an event! _> now reinsert them", output);
            insertEventDjs(id, djs);

            // createdEventINFO = JSON.parse( output );
            // console.log("Updated an event with JSON output:", createdEventINFO);
        }
    });
}

//4. Delete
function deleteEvent(eventId){

//1. Delete Event 2. Delete Djs

console.log("Deleting An Event!!");
$.ajax({ url: 'db-edit.php',
    data: { action: 'event-delete', eventId: eventId.toString() },
    type: 'post',
    success: function(output) {
                // console.log("delete Event() GONEWWOWW raw output:", output);
                wipePreviousDjsForEvent(eventId);                
                refreshEvents(); //Refereshes the events table, can do this in sync with deleting djs coz it doesnt show on the main table
                // deletedEventINFO = JSON.parse( output );
                // console.log("EVENT DEAD TO THE GAME: got this info", deletedEventINFO);                
            }
        });

}


function wipePreviousDjsForEvent(eventId){

   $.ajax({ url: 'db-edit.php',
    data: { action: 'event-djs-delete', eventId: eventId.toString()},
    type: 'post',
    success: function(output) {
            // console.log("insert event DELETETIOGN djs returned. output: ", output);
            // createdEventINFO = JSON.parse( output );
        }});
};

/*Using a timeout to give the database a chance. Could also show a loading spinner here*/
    
function refreshEvents(){

    $("#spinner-wrap").fadeIn();

    setTimeout(function(){ 
        getEvents(); 
        $("#spinner-wrap").fadeOut(800);
        // $("#spinner-wrap").removeClass("show-me");
    }, 1000);
}

function refreshDjs(){
    console.log("Refreshing DJS");
    $("#spinner-wrap").fadeIn();

    setTimeout(function(){ 
        getCurrentDjs(); 
        $("#spinner-wrap").fadeOut(800);
    }, 1000);
}




/*LOL*/
var urlRegex = /(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/im;
function setVideoURL(url){
    if (!urlRegex.test(url.toString())){
        if (confirm( "'" + url + "' doesn't look like a url, are you sure you want to upload it?") ){
            ajaxVideoURL(url); 
        }
    } else {
        ajaxVideoURL(url);
    }    
}

function ajaxVideoURL(url){
    console.log("Setting Video URL to", url);
    $.ajax({ url: 'db-edit.php',
        data: { action: 'video-create', videourl: url.toString()},
        type: 'post',
        success: function(output) {
            alert(url + " successfully set as ODS video");
            console.log("setVideoURL() raw output:", output);
            }
        });
}