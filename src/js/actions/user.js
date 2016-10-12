import { instance as user } from '../lib/user'
import { checkStatus, parseJSON } from '../lib/fetch'

export default {
	login (email, password) {
		return (dispatch) => {
			dispatch({ type: 'USER_LOGIN' })

			var auth = new Buffer(email + ':' + password)
				.toString('base64')

			return fetch('/users/login', {
				headers: {
					'Authorization': 'Basic ' + auth,
					'Accept': 'application/json',
				},
			})
				.then(checkStatus)
				.then(parseJSON)
				.then((item) => {
					dispatch({ type: 'USER_LOGIN_SUCCESS', item })
					return item
				})
				.catch((err) => {
					user.clear()
					dispatch({ type: 'ERROR_ADD', err })
					dispatch({ type: 'USER_LOGIN_FAIL', err })
					return Promise.reject(err)
				})
		}
	},

	logout () {
		user.clear()
		return { type: 'USER_LOGOUT' }
	},

	create (data) {
		return (dispatch) => {
			dispatch({ type: 'USER_CREATE' })

			return fetch('/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify(data),
			})
				.then(checkStatus)
				.then(parseJSON)
				.then((item) => {
					dispatch({ type: 'USER_CREATE_SUCCESS', item })
					return item
				})
				.catch((err) => {
					user.clear()
					dispatch({ type: 'ERROR_ADD', err })
					dispatch({ type: 'USER_CREATE_FAIL', err })
					return Promise.reject(err)
				})
		}
	},
}
