<?php

$app->options('{route:.*}', function () {
	return response()->json();
});

$app->get('users/login', ['uses' => 'UserController@login']);
resource('users', 'UserController');

$app->get('forecasts/{id}', ['uses' => 'ForecastController@show']);

$app->get('/', function () {
	return response(file_get_contents(public_path('assets/index.html')))
		->header('Content-Type', 'text/html');
});
$app->get('/favicon.ico', function () {
	return response('', 200);
});
