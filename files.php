<?$clear=array();
$clear['file']=htmlspecialcharsEx(trim($_POST['data']['files']['0']));
$size_file = round($_POST['data']['size']/1000/1000,3);

if ($clear['file']) {
	$fls=explode('/', $clear['file']);
	echo '/uploads/'.$fls[count($fls)-1].'#'.$size_file.'mb';	
}