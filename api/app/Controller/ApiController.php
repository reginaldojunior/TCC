<?php

namespace App\Controller;

use App\Config\Database;

class ApiController
{
	protected $Database;

	public function __construct()
	{
		$this->Database = new Database;
	}

	public function checkUserAndPass($user, $pass)
	{
		if (empty($user) || !isset($user))
			return false;

		if (empty($pass) || !isset($pass))
			return false;

        $user = $this->Database->getMapper()->users(['username' => $user, 'password' => $pass])->fetchAll();

        if (empty($user) || !isset($user))
        {
        	echo json_encode(['status' => false]);
        	return false;
        }

        echo json_encode(['status' => true]);	
        return true;
	}

	public function createLatAndLogWithUserId($latitude, $logitude, $userId)
	{

    	$tracking         	  = new \stdClass();

		$tracking->latitude	  = $latitude;
		$tracking->logitude   = $logitude;
		$tracking->user_id    = $userId;
		
		$response = $this->Database->getMapper()->tracking->persist($tracking);
	    
	    $this->Database->getMapper()->flush();

	    if ($response)
	    {
	    	echo json_encode(['status' => $tracking]);
	    	exit;
	    }

	    echo json_encode(['status' => false]);
	    exit;
	}

	public function getLastLocations($userId)
	{
		$response = $this->Database->getMapper()->tracking(['user_id' => $userId])->fetchAll();

		echo json_encode($response);
		exit;
	}

}