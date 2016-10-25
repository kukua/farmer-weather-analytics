<?php

namespace App\Models;

use Model;
use App\Models\Traits\ISO8601Dates;

class Location extends Model {
	use ISO8601Dates;

	protected $connection = 'mysql-forecasts';

	static $rules = [
		'city' => 'required',
		'country' => 'required',
		'timezone' => 'required',
		'latitude' => 'required|numeric',
		'longitude' => 'required|numeric',
		'altitude' => 'required|integer',
	];
	protected $fillable = ['city', 'country', 'timezone', 'latitude', 'longitude', 'altitude'];
	public $timestamps = true;
}
