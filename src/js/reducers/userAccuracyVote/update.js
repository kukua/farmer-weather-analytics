const initial = {
	loading: false,
}

export default (state = initial, action) => {
	switch (action.type) {
	case 'USER_ACCURACY_VOTE_UPDATE':
		return Object.assign({}, initial, {
			loading: true,
		})
	case 'USER_ACCURACY_VOTE_UPDATE_FAIL':
		return Object.assign({}, initial, {
			loading: false,
		})
	case 'USER_ACCURACY_VOTE_UPDATE_SUCCESS':
		return Object.assign({}, initial, {
			loading: false,
			item: action.item,
		})
	}

	return state
}
