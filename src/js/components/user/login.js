import React from 'react'
import { connect } from 'react-redux'
import Title from '../title'
import { Link } from 'react-router'
import { instance as user } from '../../lib/user'
import actions from '../../actions/user'

const mapStateToProps = (state) => {
	var { loading: isFetching, item } = state.user.login
	return { isFetching, item }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onLogin (email, password) {
			return dispatch(actions.login(email, password))
		}
	}
}

class Login extends React.Component {
	onSubmit (ev) {
		ev.preventDefault()

		var form = ev.target
		this.props.onLogin(form.email.value, form.password.value).then((item) => {
			user.set(item)
			this.context.router.replace('/')
		})
	}

	render () {
		return (
			<div class="row">
				<div class="col-sm-offset-2 col-sm-8">
					<div class="alert alert-info" role="alert">
						<b>New here?</b> Welcome! In order to login you need to register first. Please click on the register button and create your account.
					</div>
					<Title title="Login" backButton={false} />
					<form class="form form-horizontal" method="POST" onSubmit={this.onSubmit.bind(this)}>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label" for="email">E-mail address</label>
							<div class="col-sm-6">
								<input type="email" id="email" name="email" class="form-control" disabled={this.props.isFetching} />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label" for="password">Password</label>
							<div class="col-sm-6">
								<input type="password" id="password" name="password" class="form-control" disabled={this.props.isFetching} />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label"></label>
							<div class="col-sm-6">
								<Link to="/users/register" class="btn btn-primary pull-left">Register</Link>
								<button type="submit" class="btn btn-success pull-right" disabled={this.props.isFetching}><i class="fa fa-chevron-right text-left" />Login</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

Login.propTypes = {
	onLogin: React.PropTypes.func.isRequired,
	isFetching: React.PropTypes.bool.isRequired
}
Login.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Login)
