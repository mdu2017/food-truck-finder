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

// Rates a FoodTruck in the Database
export function rateFT(user_ID, truck_ID, message, rating) {
	return axios.post(
		'api/user/rate?user_ID=' +
		user_ID +
		'&truck_ID=' +
		truck_ID +
		'&message=' +
		message +
		'&rating=' +
		rating
	);
}

export function getRatingByUser(user_ID) {
	console.log(user_ID);
	return axios.get('api/user/getRatingByUser?user_ID=' + user_ID);
}

// Multivalue axios post
export function sendNotification(message, foodTruckId) {
	console.log(message);
	return axios.post(
		'api/food-truck/send-notification?message=' +
		message +
		'&foodTruckId=' +
		foodTruckId
	);
}

// Deletes a FoodTruck in the Database
export function removeFoodTruck(truck_id) {
	console.log(truck_id);
	return axios.post(
		'/api/food-truck/removeTruck/?truck_id=' + truck_id.truck_id
	);
}

export function getFoodTypes() {
	return axios.get('/api/food-truck/getFoodTypes');
}

export function getStatuses() {
	return axios.get('/api/food-truck/getStatusNames');
}

export function viewUser(username) {
	return axios.get('/unsecure/user/' + username);
}

export function getRecommendations(userlat, userlong) {
	return axios.get('/unsecure/recommendations', {
		params: {
			userlat: userlat,
			userlong: userlong
		}
	});
}

export function getNotifications(userId) {
	return axios.get('/api/user/getNotifications?userId=' + userId);
}

export function subscribe(foodtruckId, userId) {
	return axios.post(
		'api/food-truck/subscribe?ftid=' + foodtruckId + '&userid=' + userId
	);
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

// TODO: get truck location
export function getTruckLocation(id){
	return axios.get('/api/food-truck/getCurrentLocation', {
		params: {
			owner_id: id
		}
	});
}

export function searchFoodTrucks(name){
    return axios.get('/api/food-truck/searchFoodTrucks', {
        params: {
            name: name
        }
    });
}

export function getCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
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
			return dispatch(Actions.authenticate(user.principal, user.password));
		});
	};
};

//Create food truck
Actions.createFT = foodTruck => {
	return () => {
		return createFoodTruck(foodTruck);
	};
};

Actions.sendNotification = (message, foodTruckId) => {
	return () => {
		return sendNotification(message, foodTruckId);
	};
};

//Delete food truck
Actions.removeFoodFT = truck_id => {
	return () => {
		return removeFoodTruck(truck_id);
	};
};

// Save food truck
Actions.saveFoodFT = foodTruck => {
	return () => {
		return createFoodTruck(foodTruck);
	};
};

// Rates a food truck
Actions.rateFT = (user_ID, truck_ID, message, rating) => {
	return () => {
		return rateFT(user_ID, truck_ID, message, rating);
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

//TODO: Work in progress
Actions.getTruckLocation = owner_id => {
	return dispatch => {
		return dispatch(getTruckLocation(owner_id));
	};
};

Actions.searchFoodTrucks = name => {
	return () => {
		return searchFoodTrucks(name);
	};
};

Actions.update = user => {
	return dispatch => {
		return update(user).then(() => {
			return dispatch(Actions.authenticate(user.principal, user.password));
		});
	};
};

Actions.authenticate = (username, password) => {
	return dispatch => {
		return authenticate(username, password)
			.then(authentication => {
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
			})
			.catch(() =>
				alert('Email and password combination is invalid, please try again')
			);
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

//Set food truck
Actions.setFoodTruck = foodTruck => {
	return { type: Actions.Types.SET_FOOD_TRUCK, foodTruck };
};

Actions.setUser = user => {
	return { type: Actions.Types.SET_USER, user };
};

Actions.viewUser = username => {
	return () => {
		return viewUser(username).then(user => {
			document.cookie = 'searchedUser=' + user + '; path=/';
			window.alert(document.cookie);
		});
	};
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
