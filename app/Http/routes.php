<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

//MAIN ROUTES
$app->get('/','MainController@index');

//API ROUTES
$app->get('/api/v1/servers','ApiController@getServers');
$app->get('/api/v1/ping_servers','ApiController@pingServers');