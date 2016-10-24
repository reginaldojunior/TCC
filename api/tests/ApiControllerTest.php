<?php 

use \App\Controller\ApiController;

class ApiControllerTest extends PHPUnit_Framework_TestCase
{

	protected $ApiController;
	protected $client;	

	public function setUp()
	{
		$this->ApiController = new ApiController;
		$this->client = new GuzzleHttp\Client([
            'base_uri' => 'http://localhost:8000'
        ]);
	}

	public function testIfUserisValid()
	{
		$userIsValid = $this->ApiController->checkUserAndPass('reginaldo', 'teste');

		$this->assertTrue($userIsValid);
	}

	public function testIsUserIsInvalid()
	{
		$userIsValid = $this->ApiController->checkUserAndPass('reginaldo', 'teste123');

		$this->assertTrue(!$userIsValid);
	}

	public function testGetOnRouteUserValid()
	{
		$response = $this->client->get('/users/reginaldo/teste', []);

		$this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('status', $data);
        $this->assertEquals(true, $data['status']);
	}

	public function testGetOnRouteUserInvalid()
	{
		$response = $this->client->get('/users/reginaldo/junior', []);

		$this->assertEquals(200, $response->getStatusCode());

        $data = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('status', $data);
        $this->assertEquals(false, $data['status']);
	}

}