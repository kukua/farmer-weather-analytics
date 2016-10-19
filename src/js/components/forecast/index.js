import React from 'react'
import moment from 'moment'
import Title from '../title'
import { connect } from 'react-redux'
import { instance as user } from '../../lib/user'
import actions from '../../actions/forecast'

const formatType = (forecast) => {
	// ucfirst
	return forecast.type.substr(0, 1).toUpperCase() + forecast.type.substr(1)
}
const formatDate = (forecast) => {
	return moment(forecast.date).utc().format('YYYY-MM-DD' + (forecast.type === 'hourly' ? ' HH:mm' : ''))
}

const mapStateToProps = (state) => {
	var { loading: isFetching, items } = state.forecast.fetchAll
	return { isFetching, items }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onFetch (userId, date) {
			return dispatch(actions.fetchByUserIdAndDate(userId, date))
		},
	}
}

class Index extends React.Component {
	loadData () {
		// TODO(mauvm): Allow passing in date as url parameter and determine isToday with that value
		this.props.onFetch(user.id, moment().utc().format('YYYY-MM-DD'))
	}
	componentWillMount () {
		this.loadData()
	}

	render () {
		var isLoading = (this.props.isFetching)
		var isToday = isLoading || (this.props.items && moment(this.props.items[0].date).isSame(moment(), 'day'))

		return (
			<div>
				<Title title="Forecasts" backButton={false} />
				<table class="table table-striped">
					<thead>
						<tr>
							<th>Type</th>
							<th>Date</th>
							<th>Temperature</th>
							<th>Rainfall</th>
							<th>Wind speed</th>
							{isToday
								? <th>Similar?</th>
								: <th>Accurate?</th>
							}
						</tr>
					</thead>
					<tbody>
						{isLoading
							? <tr><td colSpan="6">Loading…</td></tr>
							: (this.props.items
								? this.props.items.map((forecast, i) => (
									<tr key={'' + i}>
										<td>{formatType(forecast)}</td>
										<td>{formatDate(forecast)}</td>
										<td>{forecast.temp}</td>
										<td>{forecast.rain}</td>
										<td>{forecast.windSpeed}</td>
										<td>
										</td>
									</tr>))
								: <tr><td colSpan="6">No items…</td></tr>
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
	items: React.PropTypes.array,
}
Index.contextTypes = {
	router: React.PropTypes.object.isRequired,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Index)
