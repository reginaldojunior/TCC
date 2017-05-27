<?php

header('Access-Control-Allow-Origin: *');

require_once '../vendor/autoload.php';

require_once '../app/routes.php';

$r3->run();
