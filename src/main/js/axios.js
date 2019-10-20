import axios from 'axios';

// Registers a User in the Database
export function register(user) {
	return axios.post('/api/user/register', user);
}

// Updates a User in the Database
export function update(user) {
	return axios.post('/api/user/update', user);
}

// Creates a FoodTruck in the Database
export function createFoodTruck(foodTruck) {
	return axios.post('/api/food-truck/save', foodTruck);
}

// Saves a FoodTruck in the Database
export function saveFoodTruck(foodTruck) {
	return axios.post('/api/food-truck/save', foodTruck);
}

export function authenticate(username, password) {
	return axios({
		method: 'post',
		url: '/oauth/token',
		params: {
			grant_type: 'password',
			username,
			password
		},
		auth: {
			username: 'food-truck-finder-app',
			password: 'food-truck-finder-app-secret'
		}
	});
}

// Gets User's Details from the Database
export function getUserDetails() {
	return axios.get('/api/user');
}

// Gets a Food Truck's Details from the Database
export function getFoodTruckDetails(id) {
	return axios.get(`/api/food-truck/${id}`);
}

// Gets a list of FT IDs owned by an owner from the Database
export function getOwnerFoodTruckIDs(owner_id) {
	return axios.get('/api/user/owner/getFoodTrucks', {
		params: {
			id: owner_id
		}
	});
}

// Get a list of Foods Trucks by Owner
export function getFoodTrucksByOwner(id) {
	return axios.get('/api/food-truck/getFoodTrucksByOwner', {
		params: {
			owner_id: id
		}
	});
}

export function getCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

let State = {};

State.getAuthentication = state => {
	return state.authentication;
};

State.getUser = state => {
	return state.user;
};

export { State };

let Actions = {};

Actions.Types = {
	SET_AUTHENTICATION: 'SET_AUTHENTICATION',
	SET_USER: 'SET_USER'
};

Actions.register = user => {
	return dispatch => {
		return register(user).then(() => {
			return dispatch(
				Actions.authenticate(user.principal, user.password)
			);
		});
	};
};

//Create food truck
Actions.createFT = foodTruck => {
	return () => {
		return createFoodTruck(foodTruck);
	};
};

Actions.getOwnerFoodTruckIDs = id => {
	return () => {
		return getOwnerFoodTruckIDs(id);
	};
};

Actions.getFoodTrucksByOwner = owner_id => {
	return dispatch => {
		return dispatch(getFoodTrucksByOwner(owner_id));
	};
};

Actions.update = user => {
	return dispatch => {
		return update(user).then(() => {
			return dispatch(
				Actions.authenticate(user.principal, user.password)
			);
		});
	};
};

Actions.authenticate = (username, password) => {
	return dispatch => {
		return authenticate(username, password).then(authentication => {
			dispatch(Actions.setAuthentication(authentication));
			document.cookie =
				'authentication=' + JSON.stringify(authentication) + '; path=/';

			return getUserDetails().then(user => {
				dispatch(Actions.setUser(user));
				document.cookie = 'user=' + JSON.stringify(user) + '; path=/';

				if (getCookie('user') != null) {
					window.location.href = '/#/';
				} else {
					window.alert(
						'This email and password combination is not valid, please try again'
					);
				}
			});
		}).catch(() => alert('Email and password combination is invalid, please try again'));
	};
};

Actions.logout = () => {
	return () => {
		Actions.setAuthentication(null);
		Actions.setUser(null);
		document.cookie =
			'authentication= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = 'user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		window.location.href = '/';
	};
};

Actions.setAuthentication = authentication => {
	return { type: Actions.Types.SET_AUTHENTICATION, authentication };
};

Actions.setUser = user => {
	return { type: Actions.Types.SET_USER, user };
};

export { Actions };

let Reducers = {};

Reducers.authentication = (authentication = null, action) => {
	switch (action.type) {
		case Actions.Types.SET_AUTHENTICATION: {
			return action.authentication;
		}
		default: {
			return authentication;
		}
	}
};

Reducers.user = (user = null, action) => {
	switch (action.type) {
		case Actions.Types.SET_USER: {
			return action.user;
		}
		default: {
			return user;
		}
	}
};

export { Reducers };