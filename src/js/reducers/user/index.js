import { combineReducers } from 'redux'
import login from './login'
import create from './create'
import update from './update'

export default combineReducers({
	login,
	create,
	update,
})
