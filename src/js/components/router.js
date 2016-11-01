import React from 'react'
import { Router, IndexRedirect, Route, Redirect, hashHistory } from 'react-router'
import moment from 'moment'
import { instance as user } from '../lib/user'
import notify from '../lib/notify'

import Layout from './layout/master'
import NoMatch from './noMatch'

import UserLogin from '../components/user/login'
import UserRegister from '../components/user/register'

import ForecastIndex from '../components/forecast/index'
import FeedbackIndex from '../components/feedback/index'

function requireAuthentication (nextState, replace) {
	if ( ! user.isLoggedIn) return replace('/users/login')
	if ( ! user.isActive) {
		notify.error('Account not activated.')
		return replace('/users/login')
	}
}

function isAuthenticated (nextState, replace) {
	if (user.isLoggedIn && user.isActive) return replace('/')
}

export default (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRedirect to="/forecasts" />
			<Route path="users/login" component={UserLogin} onEnter={isAuthenticated} />
			<Route path="users/register" component={UserRegister} onEnter={isAuthenticated} />

			// Forecast CRUD
			<Redirect from="forecasts" to={'forecasts/' + moment().utc().format('YYYY-MM-DD')} />
			<Route path="forecasts/:date" component={ForecastIndex} onEnter={requireAuthentication} />

			// Feedback form
			<Route path="feedback" component={FeedbackIndex} onEnter={requireAuthentication} />

			<Route path="*" component={NoMatch} />
		</Route>
	</Router>
)
