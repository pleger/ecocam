<?php

function resolve($id){
    if($_GET[$id]){
        return $_GET[$id];
    }

    if($_GET[$id]){
        return $_POST[$id];
    }

    return false;
}

function dbg($str){
    if(resolve("dbg")){
        print("<pre>$str\n");
    }
}

$url = resolve("url");
dbg("$url");

if($url){
    $js = stripos(php_uname("s"), "windows")? "js.exe" : "../js";
    $wget = stripos(php_uname("s"), "windows")? "wget.exe" : "wget";

    //transform
    dbg("$wget -q -O - $url | $js -f launcher.js");
    dbg("");
    //fix
    //$file = strrchr($url, "/");
    //passthru("cat /cygdrive/d/Proyectos/AspectScript/aspectscript/demo$file | $js -f launcher.js");
    //escape
    //$url = escapeshellarg($url);

    header("Access-Control-Allow-Origin: *"); //allows cross-site requests

    passthru("$wget -q -O - $url | $js -f launcher.js", $a);
    dbg($a);
}

exit(0);
?>
