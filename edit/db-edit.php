<?php 


function postContainsArguments($args) {

    $setCount = 0;

    foreach ($args as $arg) {
        $arg = (string)$arg;
        if(isset($_POST[$arg]) && !empty($_POST[$arg])) {
             $setCount++;
        }
    }
    return $setCount;
}


if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = strtolower( $_POST['action'] );
    $query = "";

    /*YOU CHOOSE THE QUERIES BASED ON THE POST VARIABLE VALUE*/
    switch($action) {

        /*DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ */
        /*DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ */
        /*DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ DJ crud ~ */

        case 'dj-create' : 

                            $presentArgs = ['name', 'bio', 'imgurl'];
                          
                            if (postContainsArguments($presentArgs) == 3){

                                $name = $_POST['name'];
                                $bio = $_POST['bio'];
                                $imgurl = $_POST['imgurl'];

                                $query = "INSERT INTO
                                    djs (name, bio, imgurl)
                                    VALUES
                                    ('$name', '$bio', '$imgurl')";  
                            } else {
                                die("Insufficient DJ info provided! " + postContainsArguments($presentArgs) + " / 3 !"); 
                            }
                            break;

        case 'dj-update' : 

                            $presentArgs = ['name', 'bio', 'imgurl', 'id'];
                          
                            if (postContainsArguments($presentArgs) == 4){

                                $name = $_POST['name'];
                                $bio = $_POST['bio'];
                                $imgurl = $_POST['imgurl'];
                                $id = $_POST['id'];

                                 $query =   "UPDATE djs
                                            SET name = '$name', bio = '$bio', imgurl = '$imgurl'
                                            WHERE id = $id";
                            } else {
                                die("Insufficient DJ info provided! For update.... " + postContainsArguments($presentArgs) + " / 3 !"); 
                            }
                            break;

       case 'dj-delete':    

                            $presentArgs = ['imgurl', 'id'];
                          
                            if (postContainsArguments($presentArgs) == 2){
                                $id = $_POST['id'];
                                 $query =   "DELETE FROM djsforevent
                                            WHERE djid = $id; --- This is a foreign key, so gotta take it out first or you violate the constraint
                                            
                                            DELETE FROM djs 
                                            WHERE id = $id;";

                                $path = $_POST['imgurl']; //Already the full src path to the img (assuming php and index are in the same dir)
                                unlink($path);

                            } else {
                                die("Insufficient DJ info provided! For delete.... " + postContainsArguments($presentArgs) + " / 2 !"); 
                            }
                            break;

        case 'dj-get': 
                            $query = "SELECT * FROM djs";
                            break;


        /*EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + */
        /*EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + */
        /*EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + */
        /*EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + EVENT crud + */

        case 'event-get':
                            $query = "SELECT events.city, events.date,  events.display,  events.id
                                    FROM events 
                                    ORDER BY events.date";
                            break;
        case 'event-get-djs' :  
    
                            $presentArgs = ['id'];
                            if( postContainsArguments($presentArgs) == 1){
                                $id = $_POST['id'];

                                $query = "SELECT djs.id ---  events.id, events.date, events.city, djs.name, djs.bio, djs.imgurl, 
                                FROM events 
                                INNER JOIN djsforevent 
                                ON events.id = djsforevent.eventid
                                INNER JOIN djs
                                ON  djs.id = djsforevent.djid
                                WHERE events.id = $id";
                            } else {
                                die("Insufficient DJ info provided! For update.... " + $setCount + " / 3 !"); 
                            }
                            break;

        case 'event-create': 
                            $presentArgs = ['name', 'date', 'display'];
                            if( postContainsArguments($presentArgs) == 3){

                                $name = $_POST['name'];
                                $date = $_POST['date'];
                                $display = $_POST['display'];

                                $query = "INSERT INTO events
                                        (date, city, display)
                                        VALUES
                                        ('$date', '$name', $display)
                                        RETURNING id;";
                            } else {
                                die("Insufficient event creation provided!.... " + $setCount + " / 3 !"); 
                            }
                            break;

        case 'event-djs-create':
                            $presentArgs = ['eventId', 'djs'];
                            if( postContainsArguments($presentArgs) == count($presentArgs) ){

                                $eventId = $_POST['eventId'];
                                $djArray = json_decode($_POST['djs'], true);

                                $query = "INSERT INTO djsforevent
                                          (eventid, djid)
                                          values\n";

                                  /*Add each DJ into the values*/
                                foreach ($djArray as $djId) {
                                    $query .= "($eventId, $djId),";
                                }

                                $query = rtrim($query,','); //Kill trailing comma
                                // $query .= ";";
                            }

                            break;

        case 'event-update':
                            $presentArgs = ['name','date','display','id'];
                            if( postContainsArguments($presentArgs) == count($presentArgs) ){
                                 $name = $_POST['name'];
                                $date = $_POST['date'];
                                $display = $_POST['display'];
                                $id = $_POST['id'];

                                $query = "UPDATE events
                                SET date='$date', city='$name', display=$display
                                WHERE id=$id";
                            }

        case 'event-djs-delete': //STILL UNTESTED
                            $presentArgs = ['eventId'];
                            if( postContainsArguments($presentArgs) == count($presentArgs) ){
                                $eventId = $_POST['eventId'];                                                    
                                $query = "DELETE FROM djsforevent
                                WHERE eventid = $eventId";
                            }
                            break;

        case 'event-delete':
                            $presentArgs = ['eventId'];
                            if( postContainsArguments($presentArgs) == count($presentArgs) ){
                                $eventId = $_POST['eventId'];                                                    
                                $query = "DELETE FROM djsforevent
                                          WHERE eventid = $eventId; --- FOREIGN KEY - delete first

                                          DELETE FROM events
                                          WHERE id = $eventId";
                            } else {
                                die ("THERE WERE NOT ENOUGH ARGS MANNN >>>" . postContainsArguments($presentArgs));
                            }
                            break;

        case 'video-create':
                            $presentArgs = ['videourl'];
                            if( postContainsArguments($presentArgs) == count($presentArgs) ){
                                $videoURL = $_POST['videourl'];                                                    
                                $query = "INSERT INTO videourl (url) VALUES ('$videoURL')";
                            } else {
                                die ("THERE WERE NOT ENOUGH ARGS MANNN >>>" . postContainsArguments($presentArgs));
                            }
                            break;
        case 'video-get':   
                            $query = "SELECT * FROM videourl ORDER BY id DESC LIMIT 1";
                            break;

        default:
                            die("Database request *$action* was not recognised!");
                            break;
    }

    $hostname="localhost";
    $port = 5432;
    $username="XXXX";
    $password="XXXX";
    $dbname="oneday14_ods";


/* CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT */

  $db = pg_connect( "host=$hostname port=$port dbname=$dbname user=$username password=$password"  );
   if(!$db){
      echo "Error : Unable to connect to database\n";
   } else {

    /* QUERY QUERY QUERY QUERY QUERY QUERY QUERY QUERY QUERY QUERY QUERY QUERY QUERY */
        $result = pg_query($db, $query);

        if (!$result) {
          echo "An error occurred.\n";
          echo pg_last_error($db);
          exit;
        }

    /* OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT OUTPUT */
        $output = array();

        while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
            array_push($output, $row);
        }   
   }

   echo json_encode($output);
}


?>