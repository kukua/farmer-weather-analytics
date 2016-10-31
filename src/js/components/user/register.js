import React from 'react'
import { connect } from 'react-redux'
import Title from '../title'
import { instance as user } from '../../lib/user'
import actions from '../../actions/user'

const mapStateToProps = (state) => {
	var { loading: isCreating, item } = state.user.create
	return { isCreating, item }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onCreate (data) {
			return dispatch(actions.create(data))
		},
		onLogin (email, password) {
			return dispatch(actions.login(email, password))
		},
		onError (err) {
			return dispatch({ type: 'ERROR_ADD', err })
		},
	}
}

class Register extends React.Component {
	onSubmit (ev) {
		ev.preventDefault()

		var form = ev.target
		var password = form.password.value
		var passwordConfirm = form.password_confirmation.value

		if (password !== passwordConfirm) {
			this.props.onError('The passwords do not match.')
			return
		}

		this.props.onCreate({
			name: form.name.value,
			email: form.email.value,
			password,
		}).then((item) => {
			// Empty form
			form.name.value = ''
			form.email.value = ''
			form.password.value = ''
			form.password_confirmation.value = ''

			user.set(item)
			this.context.router.replace('/')
		})
	}

	render() {
		var isLoading = this.props.isCreating

		return (
			<div class="row">
				<div class="col-sm-offset-2 col-sm-8">
					<Title title="Register" />
					<form class="form form-horizontal" method="POST" onSubmit={this.onSubmit.bind(this)}>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label" for="name">Name</label>
							<div class="col-sm-6">
								<input type="name" id="name" name="name" class="form-control" disabled={isLoading} />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label" for="email">E-mail address</label>
							<div class="col-sm-6">
								<input type="email" id="email" name="email" class="form-control" disabled={isLoading} />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label" for="password">Password</label>
							<div class="col-sm-6">
								<input ref="password" type="password" id="password" name="password" class="form-control" disabled={isLoading} />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label" for="password_confirmation">Password (confirm)</label>
							<div class="col-sm-6">
								<input type="password" id="password_confirmation" name="password_confirmation" class="form-control" disabled={isLoading} />
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-offset-1 col-sm-3 control-label"></label>
							<div class="col-sm-6">
								<button type="submit" class="btn btn-success pull-right" disabled={isLoading}><i class="fa fa-chevron-right text-left" />Register</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		)
	}
}

Register.propTypes = {
	onCreate: React.PropTypes.func.isRequired,
	isCreating: React.PropTypes.bool.isRequired,
	onLogin: React.PropTypes.func.isRequired,
	onError: React.PropTypes.func.isRequired,
}
Register.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Register)
