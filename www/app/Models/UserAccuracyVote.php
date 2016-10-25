<?php

namespace App\Models;

use Model;
use App\Models\Traits\ISO8601Dates;

class UserAccuracyVote extends Model {
	use ISO8601Dates;

	static $rules = [
		'user_id' => 'required|integer',
		'location_id' => 'required|integer',
		'type' => 'required|in:daily,hourly',
		'forecast_date' => 'required|date',
		'forecast_created_at' => 'required|date',
		'accurate' => 'required|boolean',
	];
	protected $fillable = ['user_id', 'location_id', 'type', 'forecast_date',
		'type', 'forecast_date', 'forecast_created_at', 'accurate'];
	public $timestamps = true;
	public $relationships = ['user'];

	static function scopeByType ($query, $type) {
		return $query->where('type', '=', $type);
	}

	static function scopeByForecast ($query, $forecast) {
		return $query->where('location_id', '=', $forecast->id)
			->where('forecast_date', '=', $forecast->date)
			->where('forecast_created_at', '=', $forecast->created_at)
			;
	}

	function user () {
		return $this->belongsTo(User::class);
	}

	function getUserIdsAttribute () {
		return [(int) $this->user_id];
	}

	function getAccurateAttribute ($val) { return (bool) $val; }
}
