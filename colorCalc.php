<?// Файл для определения основного цвета
$im=ImageCreateFromJPEG($_POST['src']);
 
$total_R=0;
$total_G=0;
$total_B=0;
 
// Размеры изображения
$width=ImageSX($im);
$height=ImageSY($im);
 
// Подсчитать суммарные значения по RGB
for ($x=0; $x<$width; $x++) {
    for ($y=0; $y<$height; $y++) {
        $rgb=ImageColorAt($im,$x,$y);
        $total_R+=($rgb>>16) & 0xFF;
        $total_G+=($rgb>>8) & 0xFF;
        $total_B+=$rgb & 0xFF;
    }
}
 
// Прибраться за собой
ImageDestroy($im);
 
// Определение значений RGB основного цвета
$avg_R=round($total_R/$width/$height);
$avg_G=round($total_G/$width/$height);
$avg_B=round($total_B/$width/$height);
echo 'rgb('.$avg_R.','.$avg_G.','.$avg_B.')';