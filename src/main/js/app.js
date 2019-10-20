import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import axios from 'axios';

import Index from 'js/index';
import * as Axios from 'js/axios';
import * as Utils from 'js/alloy/utils/core-utils';

import 'styles/main.scss';

const reducers = [{ form: formReducer }, Axios.Reducers];

const reducer = Utils.combineReducers(reducers);
const store = createStore(
	reducer,
	{ authentication: null, user: null},
	applyMiddleware(thunkMiddleware, createLogger())
);

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

axios.interceptors.request.use(
	request => {
		let authentication = Axios.State.getAuthentication(store.getState());
		if (_.isDefined(authentication)) {
			request.headers.common['Authorization'] =
				'Bearer ' + authentication['access_token'];
		}

		return request;
	},
	error => Promise.reject(error)
);

axios.interceptors.response.use(
	response => response.data,
	error => Promise.reject(error)
);

const mountNode = document.querySelector('#main');
ReactDOM.render(
	<Provider store={store}>
		<Index />
	</Provider>,
	mountNode
);

let token = Axios.getCookie('authentication');
let uToken = Axios.getCookie('user');
if (_.isDefined(token) && _.isDefined(uToken)) {
	store.dispatch(Axios.Actions.setAuthentication(JSON.parse(token)));
	store.dispatch(Axios.Actions.setUser(JSON.parse(uToken)));
}
