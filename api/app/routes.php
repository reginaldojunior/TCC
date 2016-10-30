<?php

use Respect\Rest\Router;

use App\Controller\ApiController;

$r3 = new Router;

$r3->get('/users/*/*', function($user, $pass) {
	$ApiController = new ApiController;
    $ApiController->checkUserAndPass($user, $pass);
});


$r3->any('/lat/*/log/*/user/*', function ($latitude, $logitude, $userId) 
	{
	    $ApiController = new ApiController;
	    $ApiController->createLatAndLogWithUserId($latitude, $logitude, $userId);

	    // eu te amo vem fica comigo 
	}
);