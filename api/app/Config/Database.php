<?php

namespace App\Config;

use Respect\Validation\Validator as v;
use Respect\Relational\Mapper;
use Respect\Data\Collections\Collection;
use Respect\Relational\Sql;

class Database
{
	
	private $mapper;

	public function __construct()
	{
		$this->mapper = new Mapper(
			new \PDO( 
				"mysql:host=127.0.0.1;dbname=trackcar", "trackcar", "tr@ckCAR123" 
			) 
		);
	}

	public function getMapper()
	{
		return $this->mapper;
	}

}

