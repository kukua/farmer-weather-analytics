import { instance as user } from '../lib/user'
import { checkStatus, parseJSON } from '../lib/fetch'

export default {
	fetchByUserIdAndDate (id, date) {
		return (dispatch) => {
			dispatch({ type: 'FORECAST_FETCH_ALL' })

			return fetch('/forecasts?filter=user_id:' + id + '&date=' + date, {
				headers: {
					'Authorization': 'Token ' + user.token,
					'Accept': 'application/json',
				},
			})
				.then(checkStatus)
				.then(parseJSON)
				.then((items) => {
					dispatch({ type: 'FORECAST_FETCH_ALL_SUCCESS', items })
					return items
				})
				.catch((err) => {
					dispatch({ type: 'ERROR_ADD', err })
					dispatch({ type: 'FORECAST_FETCH_ALL_FAIL', err })
					return Promise.reject(err)
				})
		}
	},
}
