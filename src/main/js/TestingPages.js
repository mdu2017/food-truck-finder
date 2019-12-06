import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import * as Axios from 'js/axios';

export class Page1 extends React.Component {
	constructor(props) {
		super(props);
	}

	logout = () => this.props.logout();

	displayIsOwner() {
		if (this.props.user.isOwner === true) {
			return <text>Yes!</text>;
		}
		return <text>No!</text>;
	}

	render() {
		return (
			<div className="container padded">
				This is page 1.
				{_.isDefined(this.props.authentication) && (
					<div>{this.props.authentication}</div>
				)}
				{_.isDefined(this.props.user) && (
					<div>Welcome, {this.props.user.username}!</div>
				)}
				{_.isDefined(this.props.user.isOwner) && (
					<div>Owner? {this.displayIsOwner()}</div>
				)}
				<br />
				<button onClick={this.logout} className="btn btn-primary">
					Logout
				</button>
			</div>
		);
	}
}

Page1 = connect(() => ({
	authentication: Axios.getCookie('authentication'),
	user: JSON.parse(Axios.getCookie('user')),
	logout: Axios.Actions.logout()
}))(Page1);

export class HelloSend extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: 'hello', message: 'hello' };

		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// Set state.name to value in text box
	handleChangeName(event) {
		this.setState({ name: event.target.value });
	}

	// Where the axios call occurs
	handleSubmit(event) {
		// Makes sure it is not blank
		event.preventDefault();
		if (this.state.name === '') {
			this.setState({ message: 'Must Include a Name' });
			return;
		}

		// Axios call. Header defines the type of call and headers needed
		fetch('/example/hello-receive', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			// makes the values passed into a JSON value to be passed to backend
			body: JSON.stringify({
				name: this.state.name
			})
		})
			.then(
				// Gets POST promise and converts it to a dictionary
				response => response.json()
			)
			.then(
				// Takes interpreted value and extracts value at dictionary entry "name", setting state.message equal to it
				responseJson => {
					this.setState({ message: responseJson.name });
				}
			)
			.catch(error => {
				// Catches an error if it occurs
				alert(error);
			});
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label htmlFor="principalInput">Type Your Name!</label>
						<input type="text" onChange={this.handleChangeName} />
					</div>

					<input type="submit" value="Post" />
				</form>
				<br />
				<label>{this.state.name}</label>
				<br />
				<label>{this.state.message}</label>
			</div>
		);
	}
}
