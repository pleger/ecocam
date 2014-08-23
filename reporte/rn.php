<?php

class RN{
  var $USUARIO = 'usuario';
  var $COLEGIO = 'colegio';
  var $NOMBRE = 'nombre';
  var $EVENTOS = 'eventos';
  var $EXTENSION = 'csv';
  var $BD = 'db';

  function eventosToPHP($eventos){
    return json_decode($eventos,true,512);
  }

  function registroToPHP($registro){
    return json_decode($registro,true,512);
  }

  function getDatosUsuario($registro){
    return $registro[$this->USUARIO];
  }

  function getEventos($registro){
    return $registro[$this->EVENTOS];
  }

  function getColegio($usuario){
    return $usuario[$this->COLEGIO];
  }

  function getNombreAlumno($usuario){
    return $usuario[$this->NOMBRE];
  }

  function registrarColegio($path){
    $path = "$this->BD/$path";
    if (is_dir($path) == false){
      mkdir($path);
    }
  }

  function registrarEventosAlumno($nombreAlumno, $path, $eventos){
    $fp = fopen("$this->BD/$path/$nombreAlumno.$this->EXTENSION",'w');
    foreach($eventos as $evento){
      fputcsv($fp,$evento);
    }
    fclose($fp);
  }

  function getColegios(){
    $path = $this->BD;
    $colegios = array();
    if (is_dir($path)){
      if ($dh = opendir($path)){
        $contador = 0;
        while(($file = readdir($dh)) !== false){
          if(is_dir("$path/$file") && $file != "." && $file != ".." && $file !=".svn"){
            $colegios[$contador++] = $file;
          }
        }
      }
      closedir($dh);
    }
    return $colegios;
  }

  function getEventosColegio($colegio){
    $path = "$this->BD/$colegio";
    $eventos = array();
    if (is_dir($path)){
      if ($dh = opendir($path)){
        $contador = 0;
        while(($file = readdir($dh)) !== false){
          if($file != "." && $file != ".." && $file != "$colegio.$this->EXTENSION"){
            $eventos[$contador++] = array($file,$path);
          }
        }
      }
      closedir($dh);
    }
    return $eventos;
  }

  function makeBulkColegio($colegio){
    $path = "$this->BD/$colegio";
    $archivo = "$path/$colegio.$this->EXTENSION";
    $fp = fopen($archivo,'w');
    if (is_dir($path)){
      if ($dh = opendir($path)){
        while(($file = readdir($dh)) !== false){
          if($file != "." && $file != ".." && $file != "$colegio.$this->EXTENSION"){
            $tempFile = fopen("$path/$file","r");
            $contenido = fread($tempFile,filesize("$path/$file"));
            fclose($tempFile);
            fwrite($fp,"$file,\n");
            fwrite($fp,$contenido);
          }
        }
      }
      closedir($dh);
    }
    fclose($fp);
    return $archivo;
  }
}
?>
