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

export function addDeal(message, truckID, start, end) {
	return axios.post(
		'api/food-truck/addDeal?message=' +
			message +
			'&truckID=' +
			truckID +
			'&start=' +
			start +
			'&end=' +
			end
	);
}

export function getRatingByUser(user_ID) {
	return axios.get('api/user/getRatingByUser?user_ID=' + user_ID);
}

export function getSubscriptions(id) {
	return axios.get('/api/user/getSubscriptions/' + id);
}

export function getRatingByTruck(truck_ID) {
	return axios.get('unsecure/getRatingByTruck?truck_ID=' + truck_ID);
}

// Multivalue axios post
export function sendNotification(message, foodTruckId) {
	return axios.post(
		'api/food-truck/send-notification?message=' +
			message +
			'&foodTruckId=' +
			foodTruckId
	);
}

// Deletes a FoodTruck in the Database
export function removeFoodTruck(truck_id) {
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

export function viewUserByID(id) {
	return axios.get('/unsecure/user/id/' + id);
}

export function getRecommendations(userlat, userlong, radius) {
	return axios.get('/unsecure/recommendations', {
		params: {
			userlat: userlat,
			userlong: userlong,
			radius: radius
		}
	});
}

export function getAllEvents() {
	return axios.get('/api/food-truck/getAllEvents');
}

export function getEventByID(id) {
	return axios.get('/api/food-truck/getEventById?event_ID=' + id);
}

export function getAttendingTrucks(id) {
	return axios.get('/api/food-truck/getAttendingTrucks?event_ID=' + id);
}

export function getSecuredRecommendations(userID, userlat, userlong) {
	return axios.get('/api/user/recommendations', {
		params: {
			userID: userID,
			userlat: userlat,
			userlong: userlong
		}
	});
}

export function getNearby(userlat, userlong, radius) {
	return axios.get('/unsecure/nearby', {
		params: {
			userlat: userlat,
			userlong: userlong,
			radius: radius
		}
	});
}

export function viewNearbyFT(userlat, userlong) {
	return axios.get('/unsecure/viewNearbyTrucks', {
		params: {
			userlat: userlat,
			userlong: userlong
		}
	});
}

export function getNotifications(userId) {
	return axios.get('/api/user/getNotifications?userId=' + userId);
}

export function changeNotificationStatus(userId, truckId, sent) {
	return axios.post(
		'/api/user/notificationStatus?user_ID=' +
			userId +
			'&truck_ID=' +
			truckId +
			'&sent=' +
			sent
	);
}

export function removeNotification(userId, truckId, sent) {
	return axios.post(
		'/api/user/removeNotification?user_ID=' +
			userId +
			'&truck_ID=' +
			truckId +
			'&sent=' +
			sent
	);
}

export function subscribe(foodtruckId, userId) {
	return axios.post(
		'api/user/subscribe?ftid=' + foodtruckId + '&userid=' + userId
	);
}

export function unsubscribe(userId, foodtruckId) {
	return axios.post(
		'api/user/unsubscribe?user_ID=' + userId + '&truck_ID=' + foodtruckId
	);
}

export function removeReview(foodtruckId, userId) {
	return axios.post(
		'api/user/removeReview?truck_ID=' + foodtruckId + '&user_ID=' + userId
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
	return axios.get(`/unsecure/food-truck/${id}`);
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

export function searchFoodTrucks(name) {
	return axios.get('/unsecure/searchFoodTrucks', {
		params: {
			name: name
		}
	});
}

export function searchFoodTrucksByType(type) {
	return axios.get('/unsecure/searchFoodTrucksByType', {
		params: {
			type: type
		}
	});
}

export function searchTrucksByPrice(maxPrice) {
	return axios.get('/unsecure/searchTrucksByPrice', {
		params: {
			maxPrice: maxPrice
		}
	});
}

//TODO: WIP
export function searchTrucksByDistance(userLat, userLng, maxDistance) {
	return axios.get('/unsecure/searchTrucksByDistance', {
		params: {
			userLat: userLat,
			userLng: userLng,
			maxDistance: maxDistance
		}
	});
}

export function searchUsers(username) {
	return axios.get('/unsecure/user/searchUsers', {
		params: {
			username: username
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

Actions.getTruckLocation = (userlat, userlong) => {
	return dispatch => {
		return dispatch(viewNearbyFT(userlat, userlong));
	};
};

Actions.searchFoodTrucks = name => {
	return () => {
		return searchFoodTrucks(name);
	};
};

Actions.searchFoodTrucksByType = type => {
	return () => {
		return searchFoodTrucksByType(type);
	};
};

Actions.searchTrucksByPrice = maxPrice => {
	return () => {
		return searchTrucksByPrice(maxPrice);
	};
};

//TODO: WIP
Actions.searchTrucksByDistance = (userLat, userLng, maxDistance) => {
	return () => {
		return searchTrucksByDistance(userLat, userLng, maxDistance);
	};
};

Actions.searchUsers = username => {
	return () => {
		return searchUsers(username);
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
		return authenticate(username, password)
			.then(authentication => {
				dispatch(Actions.setAuthentication(authentication));
				document.cookie =
					'authentication=' +
					JSON.stringify(authentication) +
					'; path=/';

				return getUserDetails().then(user => {
					dispatch(Actions.setUser(user));
					document.cookie =
						'user=' + JSON.stringify(user) + '; path=/';

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
				alert(
					'Email and password combination is invalid, please try again'
				)
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
