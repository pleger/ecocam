<?php
  error_reporting(E_ALL);
  require('rn.php');

  $rn = new RN();

  //JSON-->PHP
  $eventos = $rn->eventosToPHP($_POST['eventos']);
  $registro = $rn->registroToPHP($_POST['registro']);


  //variables de entorno
  $datosAlumno = $rn->getDatosUsuario($registro);
  $eventos = $rn->getEventos($registro);
  $path = $rn->getColegio($datosAlumno);
  $nombreAlumno = $rn->getNombreAlumno($datosAlumno);

  //acciones
  $rn->registrarColegio($path);
  $rn->registrarEventosAlumno($nombreAlumno,$path,$eventos);
?>
