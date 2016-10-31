import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import _ from 'underscore'
import Title from '../title'
import Tooltip from '../tooltip'
import { connect } from 'react-redux'
import { instance as user } from '../../lib/user'
import actions from '../../actions/forecast'
import userAccuracyVoteActions from '../../actions/userAccuracyVote'
import userActions from '../../actions/user'

const formatDate = (forecast) => {
	var date = moment(forecast.date)
	return date.utc().format('YYYY-MM-DD' + (forecast.type === 'hourly' ? ' HH:mm' : ''))
		+ (forecast.type === 'daily' && date.isSame(moment(), 'day') ? ' (today)' : '')
}

const mapStateToProps = (state) => {
	var { loading: isFetching, item } = state.forecast.fetch
	return { isFetching, item }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onFetch (id, date) {
			return dispatch(actions.fetchByLocationIdAndDate(id, date))
		},
		onCreateVote (data) {
			return dispatch(userAccuracyVoteActions.create(data))
		},
		onUpdateVote (data) {
			return dispatch(userAccuracyVoteActions.update(data))
		},
		onUpdateUser (data) {
			return dispatch(userActions.update(data))
		},
	}
}

class Index extends React.Component {
	loadData () {
		var id = 100149954
		this.props.onFetch(id, this.props.params.date)
	}
	componentWillMount () {
		this.loadData()
	}
	componentWillReceiveProps (next) {
		if (next.params.date !== this.props.params.date) {
			setTimeout(() => this.loadData(), 0)
		}
	}

	prepareForecasts (forecasts) {
		// Add types
		var daily  = _.map(forecasts.daily , (item) => { item.type = 'daily'; return item })
		var hourly = _.map(forecasts.hourly, (item) => { item.type = 'hourly'; return item })

		return { daily, hourly }
	}

	getSettingValue (key) {
		var settings = user.get('settings')

		if ( ! _.isObject(settings) || ! settings[key]) return

		return settings[key].value
	}
	onAlertClose () {
		this.changeSetting('forecast_help', 0)
	}
	onSettingChange (ev) {
		this.changeSetting(ev.target.name, ev.target.checked ? 1 : 0)
	}
	changeSetting (key, value) {
		var settings = user.get('settings')

		if ( ! _.isObject(settings) || _.isArray(settings)) {
			settings = {}
		}

		var item = settings[key] || {}
		item.key = key
		item.value = value
		settings[key] = item

		user.set('settings', settings)

		this.props.onUpdateUser(user.get())
			.then(() => this.forceUpdate())
	}

	onVote (forecast, accurate) {
		var vote

		if (forecast.vote) {
			vote = _.extend({}, forecast.vote, { accurate })
			this.props.onUpdateVote(vote).then(() => {
				forecast.vote.accurate = accurate
				this.forceUpdate()
			})
		} else {
			vote = {
				user_id: user.id,
				location_id: forecast.id,
				type: forecast.type,
				forecast_date: forecast.date,
				forecast_created_at: forecast.created_at,
				accurate,
			}
			this.props.onCreateVote(vote).then((item) => {
				forecast.vote = item
				this.forceUpdate()
			})
		}
	}

	render () {
		var isLoading = (this.props.isFetching)
		var item = this.props.item
		var date = moment(this.props.params.date, 'YYYY-MM-DD')
		var isToday = (item && date.isSame(moment(), 'day'))
		var { daily, hourly } = (item ? this.prepareForecasts(item.forecasts) : [])
		var currentDay = date.format('YYYY-MM-DD')
		var previousDay = date.clone().subtract(1, 'day').format('YYYY-MM-DD')
		var today = moment().format('YYYY-MM-DD')
		var nextDay = date.clone().add(1, 'day').format('YYYY-MM-DD')
		var nextDayDisabled = date.isSameOrAfter(moment(), 'day')

		var showHelp          = (this.getSettingValue('forecast_help')           !== 0)
		var showDaily         = (this.getSettingValue('forecast_daily')          !== 0)
		var showHourly        = (this.getSettingValue('forecast_hourly')         !== 0)
		var showTemperature   = (this.getSettingValue('forecast_temperature')    !== 0)
		var showPrecipitation = (this.getSettingValue('forecast_precipitation')  !== 0)
		var showWindSpeed     = (this.getSettingValue('forecast_wind_speed')     !== 0)
		var showWindDirection = (this.getSettingValue('forecast_wind_direction') !== 0)
		var showHumidity      = (this.getSettingValue('forecast_humidity')       !== 0)

		var baseColSpan = (showTemperature + showPrecipitation + showWindSpeed + showWindDirection)

		var similarHeader = (
			<th class="text-right">
				{isToday ? 'Similar?' : 'Accurate?'}
				<Tooltip title={isToday
					? 'If other local weather forecasts were similar, please click the check mark next to that specific forecast. Otherwise click on the cross.'
					: 'If the weather forecast proved to be accurate, please click the check mark next to that specific forecast. Otherwise click on the cross.'
				} />
			</th>
		)

		return (
			<div class="forecast-index">
				{showHelp && (
					<div class="alert alert-info">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={this.onAlertClose.bind(this)}>
							<span aria-hidden="true">×</span>
						</button>
						<p>
							This overview shows the daily forecasts for the upcoming 7 days.
							It also shows hourly forecasts for today and previous days.
							By clicking on the buttons in the top right you can navigate between days of forecasts.
							Note that the forecast date is in the title ("Forecasts for ...").
							This means these forecasts are made on that date.
							Please help us by providing feedback on the forecast by clicking on the check mark
							if it was similar to your local forecaster (for today's forecast) and on the cross if it was not.
							When viewing older forecasts please indicate using the check or cross if the forecast was accurate, compared to the actual weather.
							Thank you!
						</p>
						<p><b>– The Kukua Team</b></p>
					</div>
				)}
				<Title title={'Forecasts for ' + currentDay + (isToday ? ' (today)' : '')} backButton={false} controlsClass="controls">
					<Link class="btn btn-primary btn-sm" to={'forecasts/' + today}
						disabled={isToday} onClick={isToday ? (ev) => ev.preventDefault() : null}>
						<i class="fa fa-chevron-down text-left" aria-hidden="true" />Go to today
					</Link>
					<div class="btn-group">
						<Link class="btn btn-primary btn-sm" to={'forecasts/' + previousDay}>
							<i class="fa fa-chevron-left text-left" aria-hidden="true" />{previousDay}
						</Link>
						<Link class="btn btn-primary btn-sm" to={'forecasts/' + nextDay}
							disabled={nextDayDisabled} onClick={nextDayDisabled ? (ev) => ev.preventDefault() : null}>
							{nextDay}<i class="fa fa-chevron-right text-right" aria-hidden="true" />
						</Link>
					</div>
				</Title>
				<div class="settings form-inline">
					<Tooltip placement="left" title="Use these checkboxes to toggle daily/hourly forecasts and table columns." />
					<div class="checkbox">
						<label><input type="checkbox" name="forecast_daily" checked={showDaily} onChange={this.onSettingChange.bind(this)} /> Daily</label>
					</div>
					<div class="checkbox">
						<label><input type="checkbox" name="forecast_hourly" checked={showHourly} onChange={this.onSettingChange.bind(this)} /> Hourly</label>
					</div>

					<div class="checkbox">
						<label><input type="checkbox" name="forecast_temperature" checked={showTemperature} onChange={this.onSettingChange.bind(this)} /> Temperature</label>
					</div>
					<div class="checkbox">
						<label><input type="checkbox" name="forecast_precipitation" checked={showPrecipitation} onChange={this.onSettingChange.bind(this)} /> Precipitation</label>
					</div>
					<div class="checkbox">
						<label><input type="checkbox" name="forecast_wind_speed" checked={showWindSpeed} onChange={this.onSettingChange.bind(this)} /> Wind speed</label>
					</div>
					<div class="checkbox">
						<label><input type="checkbox" name="forecast_wind_direction" checked={showWindDirection} onChange={this.onSettingChange.bind(this)} /> Wind direction</label>
					</div>
					<div class="checkbox">
						<label><input type="checkbox" name="forecast_humidity" checked={showHumidity} onChange={this.onSettingChange.bind(this)} /> Humidity</label>
					</div>
				</div>
				<hr />
				{showDaily && (
					<div>
						<table class="table table-striped">
							<thead>
								<tr>
									<th>Date</th>
									{showTemperature && <th>Temperature</th>}
									{showPrecipitation && <th>Precipitation</th>}
									{showWindSpeed && <th>Wind speed</th>}
									{showWindDirection && <th>Wind direction</th>}
									{similarHeader}
								</tr>
							</thead>
							<tbody>
								{isLoading
									? <tr><td colSpan={baseColSpan + 2}>Loading…</td></tr>
									: (daily
										? daily.map((forecast, i) => {
											var accurate = (forecast.vote ? forecast.vote.accurate : null)
											return (
												<tr key={'' + i}>
													<td>{formatDate(forecast)}</td>
													{showTemperature && <td>{`${forecast.tempLow} - ${forecast.tempHigh}`} °C</td>}
													{showPrecipitation && <td>{`${forecast.precip} mm (${forecast.precipChance}%)`}</td>}
													{showWindSpeed && <td>{forecast.windSpeed} km/h</td>}
													{showWindDirection && <td>{forecast.windDir}</td>}
													<td class="actions text-right">
														<div class="btn-group">
															<button class={'btn btn-sm btn-wide ' + (accurate === true ? 'btn-success' : 'btn-default')} title="Yes"
																disabled={accurate === true} onClick={() => this.onVote(forecast, true)}>
																<i class="fa fa-check" aria-hidden="true"></i>
															</button>
															<button class={'btn btn-sm btn-wide ' + (accurate === false ? 'btn-danger' : 'btn-default')} title="No"
																disabled={accurate === false} onClick={() => this.onVote(forecast, false)}>
																<i class="fa fa-close" aria-hidden="true"></i>
															</button>
														</div>
													</td>
												</tr>
											)
										})
										: <tr><td colSpan={baseColSpan + 2}>No forecasts available…</td></tr>
										)
								}
							</tbody>
						</table>
					</div>
				)}
				{showHourly && (
					<div>
						{showDaily && (
							<div>
								<br />
								<Title title="Hourly" backButton={false} />
							</div>
						)}
						<table class="table table-striped">
							<thead>
								<tr>
									<th>Date and time</th>
									{showTemperature && <th>Temperature</th>}
									{showPrecipitation && <th>Precipitation</th>}
									{showWindSpeed && <th>Wind speed</th>}
									{showWindDirection && <th>Wind direction</th>}
									{showHumidity && <th>Humidity</th>}
									{similarHeader}
								</tr>
							</thead>
							<tbody>
								{isLoading
									? <tr><td colSpan={baseColSpan + 2 + showHumidity}>Loading…</td></tr>
									: (hourly
										? hourly.map((forecast, i) => {
											var accurate = (forecast.vote ? forecast.vote.accurate : null)
											return (
												<tr key={'' + i}>
													<td>{formatDate(forecast)}</td>
													{showTemperature && <td>{forecast.temp} °C</td>}
													{showPrecipitation && <td>{`${forecast.precip} mm`}</td>}
													{showWindSpeed && <td>{forecast.windSpeed} km/h</td>}
													{showWindDirection && <td>{forecast.windDir}</td>}
													{showHumidity && <td>{forecast.humid} %</td>}
													<td class="actions text-right">
														<div class="btn-group">
															<button class={'btn btn-sm btn-wide ' + (accurate === true ? 'btn-success' : 'btn-default')} title="Yes"
																disabled={accurate === true} onClick={() => this.onVote(forecast, true)}>
																<i class="fa fa-check" aria-hidden="true"></i>
															</button>
															<button class={'btn btn-sm btn-wide ' + (accurate === false ? 'btn-danger' : 'btn-default')} title="No"
																disabled={accurate === false} onClick={() => this.onVote(forecast, false)}>
																<i class="fa fa-close" aria-hidden="true"></i>
															</button>
														</div>
													</td>
												</tr>
											)
										})
										: <tr><td colSpan={baseColSpan + 2 + showHumidity}>No forecasts available…</td></tr>
										)
								}
							</tbody>
						</table>
					</div>
				)}
			</div>
		)
	}
}

Index.propTypes = {
	onFetch: React.PropTypes.func.isRequired,
	isFetching: React.PropTypes.bool,
	params: React.PropTypes.shape({
		date: React.PropTypes.string,
	}),
	item: React.PropTypes.shape({
		forecasts: React.PropTypes.shape({
			daily: React.PropTypes.array,
			date: React.PropTypes.string,
			hourly: React.PropTypes.array,
		}),
	}),
	onCreateVote: React.PropTypes.func.isRequired,
	onUpdateVote: React.PropTypes.func.isRequired,
	onUpdateUser: React.PropTypes.func.isRequired,
}
Index.contextTypes = {
	router: React.PropTypes.object.isRequired,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Index)
