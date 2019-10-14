import React from 'react';
import { connect } from 'react-redux';

import * as Users from 'js/backend';
import { Link } from 'react-router-dom';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { principal: null, password: null };
	}

	setPrincipal = principal => this.setState({ principal });
	setPassword = password => this.setState({ password });

	handleSubmit = event => {
		this.props.authenticate(this.state.principal, this.state.password);
		event.preventDefault();
	};

	render() {
		return (
			<form name="form" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="principalInput">Email Address</label>
					<input
						type="email"
						className="form-control"
						id="principalInput"
						placeholder="Email Address"
						onChange={e => this.setPrincipal(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="passwordInput">Password</label>
					<input
						type="password"
						className="form-control"
						id="passwordInput"
						placeholder="Password"
						onChange={e => this.setPassword(e.target.value)}
					/>
				</div>

				<button type="submit" className="btn btn-primary">
					Submit
				</button>
			</form>
		);
	}
}

LoginForm = connect(
	() => ({}),
	dispatch => ({
		authenticate: (principal, password) =>
			dispatch(Users.Actions.authenticate(principal, password))
	})
)(LoginForm);

export { LoginForm };

class RegistrationForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { principal: null, password: null, username: null, owner: false };
	}

	setPrincipal = principal => this.setState({ principal });
	setPassword = password => this.setState({ password });
	setUsername = username => this.setState({ username });
	setOwner = () => this.setState({ owner: !this.state.owner }) ;

	handleSubmit = event => {
		this.props.register({
			principal: this.state.principal,
			password: this.state.password,
			username: this.state.username,
			owner: this.state.owner.toString()
		}); // Add registration
		event.preventDefault();
	};

	render() {
		return (
			<form name="form" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="principalInput">Email Address</label>
					<input
						type="email"
						className="form-control"
						id="principalInput"
						placeholder="Email Address"
						onChange={e => this.setPrincipal(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="usernameInput">Username</label>
					<input
						type="username"
						className="form-control"
						id="usernameInput"
						placeholder="Username"
						onChange={e => this.setUsername(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="passwordInput">Password</label>
					<input
						type="password"
						className="form-control"
						id="passwordInput"
						placeholder="Password"
						onChange={e => this.setPassword(e.target.value)}
					/>
				</div>

				<div className="form-group">
					<label> Owner Account:
						<input name="owner"
							   type="checkbox"
							   className="form-control"
							   id="owner"
							   value={this.state.owner}
							   onChange={this.setOwner} /></label>
				</div>

				{/* <div className="form-group">
					<label htmlFor="passwordInput">Retype Password</label>
					<input
						type="password"
						className="form-control"
						id="passwordInput"
						placeholder="Re-type Password"
						onChange={e => this.setPassword(e.target.value)}
					/>
				</div> */}

				<button type="submit" className="btn btn-primary">
					Submit
				</button>
			</form>
		);
	}
}

RegistrationForm = connect(
	() => ({}),
	dispatch => ({
		register: user => dispatch(Users.Actions.register(user))
	})
)(RegistrationForm);

export { RegistrationForm };
