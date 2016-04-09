<?php

use Respect\Rest\Router;

use App\Controller\ApiController;

$r3 = new Router;

$r3->get('/users/*', function($screenName) {
	$ApiController = new ApiController;
    $ApiController->run();
});