<?php

namespace App\Http\Controllers;

use Request;
use DB;
use Carbon\Carbon;
use App\Models\Location;
use App\Models\UserAccuracyVote;
use Laravel\Lumen\Routing\Controller as BaseController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ForecastController extends BaseController {
	public $restful = true;

	function __construct ($registerMiddleware = true) {
		$this->registerMiddleware();
	}

	protected function registerMiddleware () {
		$this->middleware('auth.token');
	}

	function show ($id) {
		$date = Carbon::createFromFormat('Y-m-d', Request::input('date', date('Y-m-d')))->startOfDay();
		$location = Location::findOrFail($id);

		$location->forecasts = [
			'date'   => $date->toIso8601String(),
			'daily'  => $this->_getForecasts('daily', $id, $date),
			'hourly' => $this->_getForecasts('hourly', $id, $date),
		];

		return $location;
	}

	protected function _getForecasts ($type, $id, Carbon $date) {
		if ($type !== 'daily' && $type !== 'hourly') {
			throw new BadRequestHttpException('Invalid type given (should be "daily" or "hourly").');
		}

		$table = $type;
		$from = $date->copy()->startOfDay();
		$to = $date->copy()->endOfDay();
		if ($type === 'daily') {
			$to->addDays(7);
		}

		$query = DB::connection('mysql-forecasts')
			->table($table . ' AS main')
			->select(DB::raw('
				*,
				DATE_FORMAT(date, "%Y-%m-%dT%H:%i:%s+0000") as date,
				DATE_FORMAT(created_at, "%Y-%m-%dT%H:%i:%s+0000") as created_at
			'))
			->where('id', '=', $id)
			->whereDate('date', '>=', $from->toDateString())
			->whereDate('date', '<=', $to->toDateString())
			->where('created_at', '=', DB::raw('(SELECT created_at FROM `' . $table . '` WHERE id = main.id ' .
				'AND date = main.date AND created_at <= "' . $date->copy()->endOfDay()->toDateString() . '" ' .
				'ORDER BY created_at DESC LIMIT 1)'))
			->groupBy('date')
			->orderBy('date')
			;

		$forecasts = $query->get();

		foreach ($forecasts as & $forecast) {
			$forecast->vote = UserAccuracyVote::byType($type)
				->byForecast($forecast)
				->select(['id', 'accurate'])
				->first()
				;
		}

		return $forecasts;
	}
}
