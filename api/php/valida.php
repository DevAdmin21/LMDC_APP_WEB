<?php

require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/BAD_REQUEST.php";
require_once __DIR__ . "/lib/recibeTexto.php";
require_once __DIR__ . "/lib/ProblemDetailsException.php";
require_once __DIR__ . "/lib/devuelveJson.php";

$saludo = recibeTexto("saludo");
$nombre = recibeTexto("nombre");

if (
 $saludo === false
 || $saludo === ""
)
 throw new ProblemDetailsException([
  "status" => BAD_REQUEST,
  "title" => "Falta el saludo.",
  "type" => "/erros/faltasaludo.html"
 ]);

if (
 $nombre === false
 || $nombre === ""
)
 throw new ProblemDetailsException([
  "status" => BAD_REQUEST,
  "title" => "Falta el nombre.",
  "type" => "/errors/faltanombre.html"
 ]);

$resultado = "{$saludo} {$nombre}.";

devuelveJson($resultado);
