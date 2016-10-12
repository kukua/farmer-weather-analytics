import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { FetchError } from '../../lib/fetch'

const mapStateToProps = (state) => {
	return { errors: state.error }
}

const mapDispatchToProps = (/*dispatch*/) => {
	return {
	}
}

class Notifications extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			handled: []
		}
	}

	componentWillMount () {
		this.handle(this.props.errors)
	}
	componentWillReceiveProps (next) {
		this.handle(next.errors)
	}
	handle (errors) {
		if ( ! _.isArray(errors)) return

		let handled = this.state.handled

		_.each(errors, (item) => {
			if (_.indexOf(handled, item) !== -1) return
			handled.push(item)

			NotificationManager.error(this.formatMessage(item), 'Whoops!')
		})

		this.setState({ handled })
	}
	formatMessage (item) {
		let message = item.err.toString()

		if (item.err instanceof FetchError) message = item.err.message

		if ( ! message) message = 'An unknown error occured.'

		return message
	}

	render () {
		return (<NotificationContainer/>)
	}
}

Notifications.propTypes = {
	errors: React.PropTypes.array
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Notifications)
