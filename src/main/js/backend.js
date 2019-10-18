import axios from 'axios';

export function register(user) {
	return axios.post('/api/user/register', user);
}

export function update(user) {
	return axios.post('/api/user/update', user);
}

//Calls the food truck Endpoint to save it to the database
export function createFoodTruck(foodTruck) {
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

//Grab user details
export function getUserDetails() {
	return axios.get('/api/user');
}

//Grab FOOD TRUCK details
export function getFoodTruckDetails() {
	return axios.get('/api/food-truck');
}

// Get list of Food Trucks
export function getOwnerFoodTruckIDs(id) {
	return axios.get('/api/user/owner/getFoodTrucks', id);
}

//
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
	SET_USER: 'SET_USER',
	SET_FOOD_TRUCK: 'SET_FOOD_TRUCK'
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
				document.cookie = 'username=' + user['username'] + '; path=/';
				document.cookie = 'userid=' + user['id'] + '; path=/';
				document.cookie =
					'owner=' + String(user['isOwner']) + '; path=/';
				document.cookie = 'email=' + user['principal'] + '; path=/';

				if (getCookie('userid') != null) {
					window.location.href = '/#/';
				} else {
					window.alert(
						'This email and password combination is not valid, please try again'
					);
				}
			});
		});
	};
};

Actions.logout = () => {
	return () => {
		Actions.setAuthentication(null);
		Actions.setUser(null);
		document.cookie =
			'authentication= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = 'user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = 'userid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = 'username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		document.cookie = 'owner= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
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
