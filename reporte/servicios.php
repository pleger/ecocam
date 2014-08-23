<?php
  error_reporting(E_ALL);
  require('rn.php');
  $rn = new RN();

  $servicio = $_GET['servicio'];


  switch ($servicio){
  case 1:
    $colegios = $rn->getColegios();
    print json_encode($colegios);
    break;
  case 2:
    $colegio = $_GET['colegio'];
    $eventos = $rn->getEventosColegio($colegio);
    print json_encode($eventos);
    break;
  case 3:
    $colegio = $_GET['colegio'];
    $url = $rn->makeBulkColegio($colegio);
    print json_encode($url);
    break;
  case 4:
    $colegio = $_GET['colegio'];
    $rn->registrarColegio($colegio);
    print "Colegio $colegio creado con exito.";
    break;
  }
?>
