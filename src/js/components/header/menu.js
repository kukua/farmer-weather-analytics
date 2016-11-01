import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { instance as user } from '../../lib/user'
import actions from '../../actions/user'

const mapStateToProps = (state) => {
	var user = state.user.login.item
	return { user }
}

const mapDispatchToProps = (/*dispatch*/) => {
	return {
	}
}

class Menu extends React.Component {
	componentWillMount () {
		user.onChange(() => {
			this.forceUpdate()
		})
	}

	onLogout () {
		actions.logout()
		this.context.router.replace('/users/login')
	}

	getMenu () {
		var isActive = (to) => _.startsWith(this.props.location.pathname, to, 1)

		if (user.isLoggedIn) {
			return (
				<div class="navbar-collapse collapse" id="navbar-main">
					<ul class="nav navbar-nav">
						<li class={isActive('forecasts') ? 'active' : ''}><Link to="forecasts">Forecasts</Link></li>
						<li class={isActive('feedback') ? 'active' : ''}><Link to="feedback">Help us improve!</Link></li>
					</ul>
					<ul class="nav navbar-nav pull-right">
						<li class="dropdown">
							<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{user.get('name')} <span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li><a href="javascript:;" onClick={this.onLogout.bind(this)}>Sign out</a></li>
							</ul>
						</li>
					</ul>
				</div>
			)
		} else {
			return (
				<div class="navbar-collapse collapse" id="navbar-main">
					<ul class="nav navbar-nav pull-right">
						<li class={isActive('/users/login') ? 'active' : ''}><Link to="/users/login">Login</Link></li>
					</ul>
				</div>
			)
		}
	}

	render () {
		return (
			<div class="navbar navbar-default navbar-fixed-top">
				<div class="container">
					<div class="navbar-header">
						<Link to="/" class="navbar-brand">Farmer Weather Analytics</Link>
						<button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					{this.getMenu()}
				</div>
			</div>
		)
	}
}

Menu.propTypes = {
	location: React.PropTypes.shape({
		pathname: React.PropTypes.string.isRequired,
	}).isRequired,
}
Menu.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Menu)
