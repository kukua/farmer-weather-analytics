<?php

namespace App\Models;

use Model;
use App\Models\Traits\ISO8601Dates;

class UserSetting extends Model {
	use ISO8601Dates;

	static $rules = [
		'user_id' => 'required|integer',
		'key' => 'required|regex:/^[a-zA-Z0-9\.\-\_]$/',
	];
	protected $fillable = ['user_id', 'key', 'value'];
	public $timestamps = true;
	public $relationships = ['user'];

	static function scopeByUser ($query, User $user) {
		return $query->where('user_id', '=', $user->id);
	}

	static function scopeWithKey ($query, $key) {
		return $query->where('key', '=', $key);
	}

	function user () {
		return $this->belongsTo(User::class);
	}

	function setKeyAttribute ($val) {
		$this->attributes['key'] = strtolower($val);
	}

	function getUserIdsAttribute () {
		return [(int) $this->user_id];
	}
}
