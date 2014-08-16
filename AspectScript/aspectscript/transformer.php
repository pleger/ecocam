<?php

function resolve($id){
  if($_GET[$id]){
    return $_GET[$id];
  }

  return $_POST[$id];
}

function dbg($str){
  if(resolve("dbg")){
    print("<pre>$str\n");
  }
}

$code = resolve("code");
$html = resolve("html");

if($code){
  $code = stripslashes($code);
  //write code to file
  $fname = tempnam("/tmp", "AS_SCRATCHPAD_");
  $handle = fopen($fname, "w");
  fwrite($handle, $code);
  fclose($handle);

  //transform
  exec("cat '$fname' | ../js -f 'launcher.js'", $output, $ret);
}

if($ret != 0){
  print("There was an error transforming your code (ret.code $ret). Please check the syntax and try again.");
  print($code);
  exit(0);
}

?>

<html>
  <script type="text/javascript" language="javascript" src="/aspectscript/external/aspectscript/aspectscript.js"></script>

  <?php print(stripslashes($html)); ?>

  <script type="text/javascript" language="javascript">
    <?php print(implode("\n", $output)); ?>
  </script>

</html>
