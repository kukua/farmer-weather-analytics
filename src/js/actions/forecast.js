import { instance as user } from '../lib/user'
import { checkStatus, parseJSON } from '../lib/fetch'

export default {
	fetchByLocationIdAndDate (id, date) {
		return (dispatch) => {
			dispatch({ type: 'FORECAST_FETCH' })

			return fetch('/forecasts/' + id + '?date=' + date, {
				headers: {
					'Authorization': 'Token ' + user.token,
					'Accept': 'application/json',
				},
			})
				.then(checkStatus)
				.then(parseJSON)
				.then((item) => {
					dispatch({ type: 'FORECAST_FETCH_SUCCESS', item })
					return item
				})
				.catch((err) => {
					dispatch({ type: 'ERROR_ADD', err })
					dispatch({ type: 'FORECAST_FETCH_FAIL', err })
					return Promise.reject(err)
				})
		}
	},
}
