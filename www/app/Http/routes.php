<?php

$app->options('{route:.*}', function () {
	return response()->json();
});

$app->get('users/login', ['uses' => 'UserController@login']);
resource('users', 'UserController');

$app->get('forecasts', function () {
	return response()->json([
		[ 'hello' => 'world' ],
		[ 'hello' => 'you' ],
	]);
});

$app->get('/', function () {
	return response(file_get_contents(public_path('assets/index.html')))
		->header('Content-Type', 'text/html');
});
