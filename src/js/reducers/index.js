import { combineReducers } from 'redux'
import error from './error'
import user from './user/'
import forecast from './forecast/'

export default combineReducers({
	error,
	user,
	forecast,
})
