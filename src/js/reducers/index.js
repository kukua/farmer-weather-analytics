import { combineReducers } from 'redux'
import error from './error'
import user from './user/'
import userAccuracyVote from './userAccuracyVote/'
import forecast from './forecast/'

export default combineReducers({
	error,
	user,
	userAccuracyVote,
	forecast,
})
