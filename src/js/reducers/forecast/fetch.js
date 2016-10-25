const initial = {
	loading: false,
}

export default (state = initial, action) => {
	switch (action.type) {
	case 'FORECAST_FETCH':
		return Object.assign({}, initial, {
			loading: true,
		})
	case 'FORECAST_FETCH_FAIL':
		return Object.assign({}, initial, {
			loading: false,
			err: action.err,
		})
	case 'FORECAST_FETCH_SUCCESS':
		return Object.assign({}, initial, {
			loading: false,
			item: action.item,
		})
	}

	return state
}
