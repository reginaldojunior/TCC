<?php

use Respect\Rest\Router;

use App\Controller\ApiController;

$r3 = new Router;

$r3->get('/users/*/*', function($user, $pass) {
	$ApiController = new ApiController;
    $ApiController->checkUserAndPass($user, $pass);
});