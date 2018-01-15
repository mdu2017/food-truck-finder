import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import Index from 'js/index';
import axios from 'axios';
import * as Users from 'users'
import * as Utils from 'utils'

import 'styles/main.scss';

const reducers = [
	{form: formReducer},
	Users.Reducers
];

const reducer = Utils.combineReducers(reducers);
const store = createStore(reducer, {}, applyMiddleware(thunkMiddleware, createLogger()));

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

axios.interceptors.response.use(request => {
	request.auth = {
		username: 'trusted-app',
		password: 'secret'
	};

	let authentication = Users.State.getAuthentication(store.getState());
	if(_.isDefined(authentication)) {
		request.headers = {
			'Authorization': 'Bearer ' + authentication['access_token']
		};
	}
}, error => Promise.reject(error));

const mountNode = document.querySelector('#main');
ReactDOM.render(<Provider store={store}><Index /></Provider>, mountNode);