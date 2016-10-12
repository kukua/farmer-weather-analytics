import React from 'react'
//import { Link } from 'react-router'
//import Title from '../title'
import { connect } from 'react-redux'
import { instance as user } from '../../lib/user'
//import { Table } from '../../lib/table'
import actions from '../../actions/forecast'

const mapStateToProps = (state) => {
	let { loading: isFetching, items } = state.forecast.fetchAll
	return { isFetching, items }
}

const mapDispatchToProps = (dispatch) => {
	return {
		onFetch (userId) {
			return dispatch(actions.fetchByUserId(userId))
		},
	}
}

class Index extends React.Component {
	loadData () {
		this.props.onFetch(user.id)
	}
	componentWillMount () {
		this.loadData()
	}

	render () {
		//let isLoading = (this.props.isFetching)

		console.log(this.props.items)
		return (<div>Hello world!</div>)

		/*
		return (
			<div>
				<Title title="Templates">
					<Link to="/templates/create" class="btn btn-sm btn-success icon-plus">Add template</Link>
				</Title>
				<Table loading={isLoading}
					columns={{
						name: {
							label: 'Name',
							key: 'name',
						},
						updatedAt: {
							label: 'Last updated',
							key: 'updated_at',
							isDate: true,
						},
					}}
					rows={this.props.items || []}
					onRowClick={(item) => this.context.router.replace('/templates/' + item.id + '/edit')} />
			</div>
		)
		*/
	}
}

Index.propTypes = {
	onFetch: React.PropTypes.func.isRequired,
	isFetching: React.PropTypes.bool,
	items: React.PropTypes.array,
}
Index.contextTypes = {
	router: React.PropTypes.object.isRequired,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Index)
