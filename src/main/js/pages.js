import _ from 'lodash';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'js/backend';
import * as Forms from 'js/forms';
import axios from 'axios';
import * as NavBars from 'js/navBar';
import {
	Progress,
	Container,
	Row,
	Col,
	Button,
	Media,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';
import SampleMenu from './images/MenuSample.png';

// import { createStore, applyMiddleware, compose} from "redux";
// import { persistStore, autoRehydrate } from 'redux-persist';
// import { AsyncStorage } from 'react-native';
// import {logger} from "redux-logger/src";

// export default function configureStore(){
//
// 	const store = createStore(reducers, getInitialState(), compose(
// 		applyMiddleware([
// 			thunk,
// 			localStorageMiddleware,
// 			logger
// 		]),
// 		autoRehydrate()
// 		)
// 	);
//
// 	persistStore(store, { storage: AsyncStorage });
//
// 	return store;
// };

export class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authentication: Users.getCookie('authentication'),
			principal: Users.getCookie('email'),
			password: Users.getCookie('password'),
			username: Users.getCookie('user'),
			owner: Users.getCookie('owner')
		};
	}

	displayCustomWelcome() {
		if (this.state.authentication) {
			return (
				<div>
					{'Welcome, '}
					{this.state.username}
					{'!'}
				</div>
			);
		}
		return <div>{'Welcome!'}</div>;
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>{this.displayCustomWelcome()}</h1>
					<NavBars.SidebarNav />
					{/* <ul> */}
					{/* <li><Link to="/hello">Example Endpoint</Link></li> */}
					{/* </ul> */}
				</div>
			</div>
		);
	}
}

export class RegisterPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div>
					<div className="row">
						<div className="col-6 offset-md-3">
							<h2>Create Account</h2>
							<hr />
							<Forms.RegistrationForm />
							<Link to="/login">Already have an account?</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export class LoginPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="row">
					<div className="col-6 offset-md-3">
						<h2>Login</h2>
						<hr />
						<Forms.LoginForm />
						<Link to="/register">Create Account</Link>
						<br />
						<Link to="/forgot-password">Forgot Password?</Link>
					</div>
				</div>
				{/* <Link to="/owner">Login Owner Success</Link>
				<br />
				<Link to="/user">Login User Success</Link> */}
			</div>
		);
	}
}

export class EventsPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the events list page.
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/events/event">Event Details</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class EventDetailsPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the event details page.
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/events">Events</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class HelpPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the help page.
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class ForgotPasswordPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="row">
					<div className="col-6 offset-md-3">
						<h2>Forgot Password?</h2>
						<hr />
						<Forms.ForgotPasswordForm />
						<Link to="/register">Need an Account?</Link>
					</div>
				</div>
			</div>
		);
	}
}

export class SearchTrucksPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the search trucks page.
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/food-truck-details">View Truck Details</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class SearchUsersPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the search users page.
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class NotificationsPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					This is the notifications page.
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export class AboutUsPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>About Us</h1>
				</div>
			</div>
		);
	}
}

export class ViewFoodTruckDetailsPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Torchy's Details Page</h1>
					<br />
					<Row>
						<Col xs="auto">
							<Button color="primary">Subscribe</Button>
						</Col>
						<Col xs="auto">
							<legend>
								Status:{' '}
								<text style={{ color: 'green' }}>Open</text>
							</legend>
						</Col>
					</Row>
					<br />
					<Row>
						<Col xs="6">
							<legend>Description</legend>
							This is a short, temporary description to describe a
							food truck. It is optional input by the owner. It
							can be updated at any time.
						</Col>
						<Col xs="3">
							<legend>Average Price</legend>
							$3.25
						</Col>
						<Col xs="3">
							<legend>Rating</legend>
							<div className="text-left">5 of 5</div>
							<Progress
								value="5"
								max="5"
								style={{ width: 100 }}
							/>
						</Col>
					</Row>
					<br />
					<Row>
						<Col>
							<legend>Menu</legend>
							<Media left href={SampleMenu}>
								<Media
									object
									src={SampleMenu}
									width={300}
									height={300}
								/>
							</Media>
						</Col>
						<Col xs="6">
							<legend>Weekly Schedule</legend>
							<Row>
								<Col xs="3">Sunday</Col>
								<Col>7pm - 8 pm</Col>
							</Row>
							<Row>
								<Col xs="3">Monday</Col>
								<Col>7pm - 8 pm</Col>
							</Row>
							<Row>
								<Col xs="3">Tuesday</Col>
								<Col>7pm - 8 pm</Col>
							</Row>
							<Row>
								<Col xs="3">Wednesday</Col>
								<Col>7pm - 8 pm</Col>
							</Row>
							<Row>
								<Col xs="3">Thursday</Col>
								<Col>7pm - 8 pm</Col>
							</Row>
							<Row>
								<Col xs="3">Friday</Col>
								<Col>7pm - 8 pm</Col>
							</Row>
							<Row>
								<Col xs="3">Saturday</Col>
								<Col>7pm - 8 pm</Col>
							</Row>
						</Col>
					</Row>
					<Row>
						<legend>Route</legend>
					</Row>
				</div>
			</div>
		);
	}
}

export class Page1 extends React.Component {
	constructor(props) {
		super(props);
	}

	logout = () => this.props.logout();

	displayIsOwner() {
		if (this.props.isOwner == 'true') {
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
					<div>Welcome, {this.props.user}!</div>
				)}
				{_.isDefined(this.props.isOwner) && (
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
	authentication: Users.getCookie('authentication'),
	user: Users.getCookie('user'),
	logout: Users.Actions.logout(),
	id: Users.getCookie('userid'),
	isOwner: Users.getCookie('owner')
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
