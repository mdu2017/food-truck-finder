import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'users'

export class Home extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the home page.

				<ul>
					<li><Link to="/page-1">Page 1</Link></li>
					<li><Link to="/page-2">Page 2</Link></li>
					<li><Link to="/page-3">Page 3</Link></li>
				</ul>
			</div>
		);
	}
}

class Page1 extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is page 1.

				{ _.isDefined(this.props.user) &&
					<div>Welcome, {this.props.user.name}!</div>
				}

				<button onClick={() => this.authenticate('user', 'password')}>Login as User</button>
			</div>
		);
	}
}

Page1 = connect(
	state => ({
		user: Users.State.getUser(state)
	}),
	dispatch => ({
		authenticate: (username, password) => dispatch(Users.Actions.authenticate(username, password))
	})
)(Page1);

export { Page1 };

export class Page2 extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is page 2.
			</div>
		);
	}
}

export class Page3 extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is page 3.
			</div>
		);
	}
}