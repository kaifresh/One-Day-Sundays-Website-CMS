

<?php

/*Store directory separator (DIRECTORY_SEPARATOR) to a simple variable. This is just a personal preference as we hate to type long variable name.
1. Declare a variable for destination folder.
2. If file is sent to the page, store the file object to a temporary variable.
3. Create the absolute path of the destination folder.
4. Create the absolute path of the uploaded file destination.
5. Move uploaded file to destination.
- See more at: http://www.startutorial.com/articles/view/how-to-build-a-file-upload-form-using-dropzonejs-and-php#sthash.MNaf7dAT.dpuf-->*/
/*<!--- See more at: http://www.startutorial.com/articles/view/how-to-build-a-file-upload-form-using-dropzonejs-and-php#sthash.MNaf7dAT.dpuf-->*/

echo "UPLOADING DJ PIC";

$ds = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = 'dj-imgs';   //2
 
if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];          //3             
      
    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4
     
    $targetFile =  $targetPath. $_FILES['file']['name'];  //5
 
    move_uploaded_file($tempFile,$targetFile); //6    
}


?>  

