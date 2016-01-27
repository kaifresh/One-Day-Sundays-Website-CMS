 <?php 

if(isset($_POST['action']) && !empty($_POST['action'])) {
    $action = strtolower( $_POST['action'] );
    $query = "";

    /*YOU CHOOSE THE QUERIES BASED ON THE POST VARIABLE VALUE*/
    switch($action) {
        case 'test' : $query = "SELECT * FROM venues"; 
            break;
        case 'venueinfo' : 
                            $city = ucfirst( strtolower($_POST['city']) );
                            $query = 
                            "SELECT events.date, events.city, venues.name, venues.address
                            FROM events 
                            INNER JOIN venues 
                            ON events.city = venues.city
                            WHERE venues.city = '$city'
                            ORDER BY events.date DESC"; //Assuming we wont be 5 months ahead of schedule
            break;
            //---- Get details for most recent party in each city
        case 'allinfo' : $query = "SELECT events.display, events.id as eventid, events.date, events.city, venues.name as venuename, venues.address, djs.id as djid, djs.name, djs.bio, djs.imgurl
                                     FROM events 
                                    INNER JOIN venues
                                    ON events.city = venues.city

                                    --- Add in DJ INFO
                                    INNER JOIN djsforevent 
                                    ON events.id = djsforevent.eventid
                                    INNER JOIN djs
                                    ON  djs.id = djsforevent.djid

                                    --- Filter for most recent date for each city (ie GROUP BY)
                                    -- WHERE events.date IN (
                                    -- SELECT MAX (date)
                                    -- FROM events
                                    -- WHERE display = true
                                    -- GROUP BY city
                                    -- )

                                    --- new filter, whereby you get the smallest date
                                    --- out of all the events ahead of the current date
                                   WHERE 
                                     events.date IN (
                                    SELECT MIN (date)
                                    FROM events
                                    WHERE display = true 
                                    AND events.date >= CURRENT_DATE - interval '7 days'
                                    GROUP BY city
                                    )

                                    ---Arbitrary but group the shit
                                    ORDER BY city, djid";
                                    break;

        case 'venuebackupinfo' : 
                            $city = $_POST['cityname'];

                            $query = "SELECT * FROM venues";
                            break;

        case 'video-get':   
                            $query = "SELECT * FROM videourl ORDER BY id DESC LIMIT 1";
                            break;

        default:
            break;
        // ...etc...
    }

    $hostname="localhost";
    $port = 5432;
    $username="XXXX";
    $password="XXXX";
    $dbname="oneday14_ods";


/* CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT CONNECT */

  $db = pg_connect( "host=$hostname port=$port dbname=$dbname user=$username password=$password"  );
   if(!$db){
      echo "Error : Unable to open database\n";
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