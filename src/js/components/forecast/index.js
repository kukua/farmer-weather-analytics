import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import _ from 'underscore'
import Title from '../title'
import { connect } from 'react-redux'
import { instance as user } from '../../lib/user'
import actions from '../../actions/forecast'
import userAccuracyVoteActions from '../../actions/userAccuracyVote'

const formatType = (forecast) => {
	return forecast.type.substr(0, 1).toUpperCase() + forecast.type.substr(1) // ucfirst
}
const formatDate = (forecast) => {
	return moment(forecast.date).utc().format('YYYY-MM-DD' + (forecast.type === 'hourly' ? ' HH:mm' : ''))
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

		// Zip
		var items = daily.splice(0, 1)
		items = items.concat(hourly)
		items = items.concat(daily)

		return items
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
		var items = (item ? this.prepareForecasts(item.forecasts) : [])
		var currentDay = date.format('YYYY-MM-DD')
		var previousDay = date.clone().subtract(1, 'day').format('YYYY-MM-DD')
		var today = moment().format('YYYY-MM-DD')
		var nextDay = date.clone().add(1, 'day').format('YYYY-MM-DD')
		var nextDayDisabled = date.isSameOrAfter(moment(), 'day')

		return (
				<div>
				<Title title={'Forecasts for ' + currentDay + (isToday ? ' (today)' : '')} backButton={false}>
					<Link className="btn btn-success btn-sm" to={'forecasts/' + today}>
						<i className="fa fa-chevron-down text-left" aria-hidden="true" />Today
					</Link>
					<div className="btn-group">
						<Link className="btn btn-info btn-sm" to={'forecasts/' + previousDay}>
							<i className="fa fa-chevron-left text-left" aria-hidden="true" />{previousDay}
						</Link>
						<Link className="btn btn-info btn-sm" to={'forecasts/' + nextDay}
							disabled={nextDayDisabled} onClick={nextDayDisabled ? (ev) => ev.preventDefault() : null}>
							{nextDay}<i className="fa fa-chevron-right text-right" aria-hidden="true" />
						</Link>
					</div>
				</Title>
				<table class="table table-striped">
					<thead>
						<tr>
							<th>Type</th>
							<th>Date</th>
							<th>Temperature</th>
							<th>Precipitation</th>
							<th>Wind speed</th>
							<th>Wind direction</th>
							<th>Humidity</th>
							<th className="text-right">{isToday ? 'Similar?' : 'Accurate?'}</th>
						</tr>
					</thead>
					<tbody>
						{isLoading
							? <tr><td colSpan="8">Loading…</td></tr>
							: (items
								? items.map((forecast, i) => {
									var accurate = (forecast.vote ? forecast.vote.accurate : null)
									return (
										<tr key={'' + i}>
											<td>{formatType(forecast)}</td>
											<td>{formatDate(forecast)}</td>
											<td>{forecast.temp || `${forecast.tempLow}-${forecast.tempHigh}`} °C</td>
											<td>{`${forecast.precip} mm` + (forecast.type === 'daily' ? ` (${forecast.precipChance}%)` : '')}</td>
											<td>{forecast.windSpeed} km/h</td>
											<td>{forecast.windDir}</td>
											<td>{forecast.humid ? `${forecast.humid} %` : ''}</td>
											<td className="actions text-right">
												<div className="btn-group">
													<button className={'btn btn-sm btn-wide ' + (accurate === true ? 'btn-success' : 'btn-default')} title="Yes"
														disabled={accurate === true} onClick={() => this.onVote(forecast, true)}>
														<i className="fa fa-check" aria-hidden="true"></i>
													</button>
													<button className={'btn btn-sm btn-wide ' + (accurate === false ? 'btn-danger' : 'btn-default')} title="No"
														disabled={accurate === false} onClick={() => this.onVote(forecast, false)}>
														<i className="fa fa-close" aria-hidden="true"></i>
													</button>
												</div>
											</td>
										</tr>
									)
								})
								: <tr><td colSpan="8">No items…</td></tr>
								)
						}
					</tbody>
				</table>
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
}
Index.contextTypes = {
	router: React.PropTypes.object.isRequired,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Index)
