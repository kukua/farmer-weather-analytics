import { instance as user } from '../lib/user'
import { checkStatus, parseJSON } from '../lib/fetch'

export default {
	create (data) {
		return (dispatch) => {
			dispatch({ type: 'USER_ACCURACY_VOTE_CREATE' })

			return fetch('/userAccuracyVotes', {
				method: 'POST',
				headers: {
					'Authorization': 'Token ' + user.token,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify(data),
			})
				.then(checkStatus)
				.then(parseJSON)
				.then((item) => {
					dispatch({ type: 'USER_ACCURACY_VOTE_CREATE_SUCCESS', item })
					return item
				})
				.catch((err) => {
					dispatch({ type: 'ERROR_ADD', err })
					dispatch({ type: 'USER_ACCURACY_VOTE_CREATE_FAIL', err })
					return Promise.reject(err)
				})
		}
	},

	update (data) {
		return (dispatch) => {
			dispatch({ type: 'USER_ACCURACY_VOTE_UPDATE' })

			return fetch('/userAccuracyVotes/' + data.id, {
				method: 'PUT',
				headers: {
					'Authorization': 'Token ' + user.token,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify(data),
			})
				.then(checkStatus)
				.then(parseJSON)
				.then((item) => {
					dispatch({ type: 'USER_ACCURACY_VOTE_UPDATE_SUCCESS', item })
					dispatch({ type: 'USER_ACCURACY_VOTE_FETCH_SUCCESS', item })
					return item
				})
				.catch((err) => {
					dispatch({ type: 'ERROR_ADD', err })
					dispatch({ type: 'USER_ACCURACY_VOTE_UPDATE_FAIL', err })
					return Promise.reject(err)
				})
		}
	},
}
