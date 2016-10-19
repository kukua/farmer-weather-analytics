<?php

$app->options('{route:.*}', function () {
	return response()->json();
});

$app->get('users/login', ['uses' => 'UserController@login']);
resource('users', 'UserController');

$app->get('forecasts', function () {
	return response()->json([
		[
			'type' => 'daily',
			'date' => '2016-10-12T00:00:00Z',
			'temp' => 12.3,
			'rain' => 0.3,
		],
		[
			'type' => 'hourly',
			'date' => '2016-10-12T01:00:00Z',
			'temp' => 10.3,
			'rain' => 0,
			'windSpeed' => 7,
		],
		[
			'type' => 'hourly',
			'date' => '2016-10-12T02:00:00Z',
			'temp' => 14.3,
			'rain' => 0.6,
			'windSpeed' => 13,
		],
		[
			'type' => 'daily',
			'date' => '2016-10-13T00:00:00Z',
			'temp' => 13.3,
			'rain' => 0.3,
			'windSpeed' => 13.9,
		],
		[
			'type' => 'daily',
			'date' => '2016-10-14T00:00:00Z',
			'temp' => 14.3,
			'rain' => 0.4,
			'windSpeed' => 14.3,
		],
		[
			'type' => 'daily',
			'date' => '2016-10-15T00:00:00Z',
			'temp' => 15.3,
			'rain' => 0.5,
			'windSpeed' => 15.0,
		],
		[
			'type' => 'daily',
			'date' => '2016-10-16T00:00:00Z',
			'temp' => 16.3,
			'rain' => 0.6,
			'windSpeed' => 16.7,
		],
		[
			'type' => 'daily',
			'date' => '2016-10-17T00:00:00Z',
			'temp' => 17.3,
			'rain' => 0.7,
			'windSpeed' => 17.2,
		],
	]);
});

$app->get('/', function () {
	return response(file_get_contents(public_path('assets/index.html')))
		->header('Content-Type', 'text/html');
});
