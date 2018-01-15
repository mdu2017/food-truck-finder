import axios from 'axios';

export function authenticate(username, password) {
	return axios.post('/oauth/token', {
		params: {
			'grant_type': 'app_access',
			username,
			password
		}
	});
}

export function getUserDetails() {
	return axios.get('/api/user');
}

let State = {};

State.getAuthentication = state => {
	return state.authentication;
};

State.getUser = state => {

};

export { State };

let Actions = {};

Actions.Types = {
	SET_AUTHENTICATION: 'SET_AUTHENTICATION',
	SET_USER: 'SET_USER'
};

Actions.authenticate = (username, password) => {
	return (dispatch) => {
		return this.authenticate(username, password).then(
			authentication => {
				dispatch(Actions.setAuthentication(authentication));

				return this.getUserDetails().then(user => {
					dispatch(Actions.setUser(user));
				});
			}
		);
	};
};

Actions.setAuthentication = authentication => {
	return {type: Actions.Types.SET_AUTHENTICATION, authentication};
};

Actions.setUser = user => {
	return {type: Actions.Types.SET_USER, user};
};

export { Actions };

let Reducers = {};

Reducers.authentication = {
	authentication: (authentication = null, action) => {
		switch (action.type) {
			case Actions.Types.SET_AUTHENTICATION: {
				return authentication;
			}
			default: {
				return authentication;
			}
		}
	},
	user: (user = null, action) => {
		switch (action.type) {
			case Actions.Types.SET_USER: {
				return user;
			}
			default: {
				return user;
			}
		}
	},
};

export { Reducers };