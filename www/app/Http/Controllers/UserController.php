<?php

namespace App\Http\Controllers;

use Request;
use Model;
use Auth;
use QueryException;
use HttpException;
use App\Models\User;
use App\Models\UserToken;

class UserController extends Controller {
	protected $class = User::class;

	protected function registerMiddleware () {
		$this->middleware('auth.token', ['except' => ['login', 'store']]);
		$this->middleware('auth.basic', ['only' => 'login']);
		$this->middleware('auth.admin', ['except' => ['index', 'show', 'login', 'store', 'update']]);
	}

	function store () {
		try {
			$model = $response = parent::store();
		} catch (QueryException $e) {
			throw new HttpException(400, $e->getPrevious()->getMessage(),
				$e, $headers = [], $e->getCode());
		}

		if ( ! ($model instanceof Model)) {
			return $response;
		}

		// Login as newly created user, to update it
		Auth::login($model);
		//
		// Update active and last_login columns
		if (config('user.active_by_default')) {
			$model->is_active = true;
		}

		$model->touchLastLogin(false);
		$model->save();

		// Create token for user
		UserToken::create([
			'user_id' => $model->id,
			'token' => UserToken::randomToken()
		]);

		$this->addIncludes($model);

		return $this->findOrFail($model->id);
	}

	function login () {
		$user = Auth::user();
		$user->touchLastLogin();

		$this->addIncludes($user);

		return $user;
	}

	function update ($id) {
		$model = $response = parent::update($id);

		if ( ! ($model instanceof Model)) {
			return $response;
		}

		// Settings
		if (Request::has('settings')) {
			$model->updateSettings((array) Request::input('settings'));
		}

		$this->addIncludes($model);

		return $model;
	}
}
