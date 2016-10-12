import { combineReducers } from 'redux'
import login from './login'
import create from './create'

export default combineReducers({
	login,
	create,
})
