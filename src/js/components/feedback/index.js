import React from 'react'
import moment from 'moment'
import _ from 'underscore'
import Title from '../title'
import { connect } from 'react-redux'
import { instance as user } from '../../lib/user'
import userActions from '../../actions/user'

const mapStateToProps = (state) => {
	var { loading: isSubmitting } = state.user.update
	return { isSubmitting }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onUpdateUser (data) {
			return dispatch(userActions.update(data))
		},
	}
}
class Index extends React.Component {
	constructor () {
		super()

		this.state = {
			rating_usability: 0,
			rating_accuracy: 0,
			feedback: '',
			dirty: false,
			submitted: false,
		}
	}

	onRatingChange (ev) {
		this.setState({ [ev.target.name]: parseInt(ev.target.value), dirty: true })
	}
	onChange (ev) {
		this.setState({ [ev.target.name]: ev.target.value, dirty: true })
	}
	onSubmit (ev) {
		ev.preventDefault()

		if ( ! this.state.dirty) return

		var settings = user.get('settings')

		if ( ! _.isObject(settings) || _.isArray(settings)) {
			settings = {}
		}

		var key = 'feedback_' + moment().format('X')
		settings[key] = {
			key,
			value: JSON.stringify(_.omit(this.state, 'dirty', 'submitted')),
		}

		user.set('settings', settings)

		this.props.onUpdateUser(user.get())
			.then(() => this.setState({ submitted: true }))
	}

	renderRatingOptions (name) {
		var options = [
			'I\'m not sure',
			'Very bad',
			'Bad',
			'Could be better',
			'Good',
			'Very good',
		]

		return (
			<div>
				{options.map((title, value) => (
					<label class="radio-inline" key={'' + value}>
						<input type="radio" name={name} value={value} checked={value == this.state[name]} onChange={this.onRatingChange.bind(this)} /> {title}
					</label>
				))}
			</div>
		)
	}

	render () {
		if (this.state.submitted) {
			return (
				<div class="alert alert-success">
					<p>
						<b>Thank you!</b> We've received your feedback and will review it as soon as possible.
					</p>
					<p><b>– The Kukua Team</b></p>
				</div>
			)
		}

		return (
			<div>
				<div class="alert alert-success">
					<p>
						<b>Hi there!</b> Since we are actively developing this weather analytics platform, we could really use your help!<br />
						Please fill in the form below with tips/suggestions on how we can improve this service.<br />
						We really appreciate your help!
					</p>
					<p><b>– The Kukua Team</b></p>
				</div>
				<Title title="Feedback form" backButton={false} />
				<form onSubmit={this.onSubmit.bind(this)}>
					<div class="form-group">
						<label>Ease of use</label>
						{this.renderRatingOptions('rating_usability')}
					</div>
					<div class="form-group">
						<label>Accuracy of forecasts</label>
						{this.renderRatingOptions('rating_accuracy')}
					</div>
					<div class="form-group">
						<label>Your comment(s)</label>
						<textarea id="feedback" class="form-control" name="feedback" value={this.state.feedback} rows={6} onChange={this.onChange.bind(this)} />
					</div>
					<div class="form-group">
						{this.props.isSubmitting
							? <button type="button" class="btn btn-success pull-right" disabled={true}>Submitting feedback…</button>
							: <button type="submit" class="btn btn-success pull-right" disabled={ ! this.state.dirty}>Submit feedback</button>
						}
					</div>
				</form>
			</div>
		)
	}
}

Index.propTypes = {
	isSubmitting: React.PropTypes.bool.isRequired,
	onUpdateUser: React.PropTypes.func.isRequired,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Index)
