<?$data = array();
$types=array('jpg', 'jpeg', 'png', 'bmp', 'pdf', 'doc', 'docx', 'txt');

if(isset($_GET['files'])) {  
    $error = false;
    $error_text = '';
    $files = array();
    $size = -1;
    $uploaddir = '/uploads/';
    $key = 0;
    foreach($_FILES as $file) {
        $nm=explode('.', $file['name']);
        if (in_array(strtolower(trim($nm[count($nm)-1])), $types) and $file['size']<10000000) {
            $size = $file['size'];
            $name = $file['name'];
            $arParams = array("replace_space"=>"-","replace_other"=>"-","safe_chars"=>".");
            $trans = $name/* Cutil::translit($name,"ru",$arParams) */;
            $dt=rand(1000,9999);
            $trans=$dt.'-'.$trans;
            if(move_uploaded_file($file['tmp_name'], $uploaddir .basename($trans))) {
                $files[] = $uploaddir .basename($trans);
            }  else {
                $error=true;
            }
        } else {
            $error=true;
            if($file['size']>10000000){
                $error_text = 'Недопустимый размер файла';
            }else{
                $error_text = 'Недопустимый тип файла';
            }
        }

        if ($error) {
          $data[$key]['error']=$error;
          $data[$key]['error_text']=$error_text;
        } else {
          $data[$key]['files']=$files;
          $data[$key]['size']=$size;
        }
        $key++;
    }
}

echo json_encode($data);