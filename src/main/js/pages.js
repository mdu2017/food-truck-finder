import _ from 'lodash';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'js/users';
import * as Login from 'js/login';
import axios from 'axios';

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
	render() {
		return (

			<div className="container padded">
				This is the home page.

				<ul>
					<li><Link to="/register">Create Account</Link></li>
					<li><Link to="/login">Login</Link></li>
					<li><Link to="/help">Help!!!</Link></li>
					<li><Link to="/events">Events</Link></li>
					<li><Link to="/view-profile">View Profile</Link></li>
					<li><Link to="/search-trucks">Search Food Trucks</Link></li>
					<li><Link to="/search-users">Search Users</Link></li>
					<li><Link to="/user/notifications">Notifications</Link></li>
					<li><Link to="/about-free-tank-top">About Us</Link></li>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/page-1">Page 1</Link></li>
					<li><Link to="/page-2">Page 2</Link></li>
					<li><Link to="/page-3">Page 3</Link></li>
					<li><Link to="/hello">Example Endpoint</Link></li>
				</ul>
			</div>
		);
	}
}

export class HomeUser extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the home page.

				<ul>
					<li><Link to="/help">Help</Link></li>
					<li><Link to="/events">Events</Link></li>
					<li><Link to="/view-profile">View Profile</Link></li>
					<li><Link to="/search-trucks">Search Food Trucks</Link></li>
					<li><Link to="/search-users">Search Users</Link></li>
					<li><Link to="/user/notifications">Notifications</Link></li>
					<li><Link to="/about-free-tank-top">About Us</Link></li>
					<li><Link to="/user">Home</Link></li>
				</ul>
			</div>
		);
	}
}

export class HomeOwner extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the home page.

				<ul>
					<li><Link to="/help">Help</Link></li>
					<li><Link to="/owner">Home</Link></li>
					<li><Link to="/events">Events</Link></li>
					<li><Link to="/owner/create-event">Create Event</Link></li>
					<li><Link to="/owner/create-special">Create Special</Link></li>
					<li><Link to="/owner/edit-food-truck">Edit Food Truck</Link></li>
					<li><Link to="/owner/create-event">Create Event</Link></li>
					<li><Link to="/owner/create-special">Create Special</Link></li>
					<li><Link to="/view-profile">View Profile</Link></li>
					<li><Link to="/search-trucks">Search Food Trucks</Link></li>
					<li><Link to="/search-users">Search Users</Link></li>
					<li><Link to="/user/notifications">Notifications</Link></li>
					<li><Link to="/about-free-tank-top">About Us</Link></li>
				</ul>
			</div>
		);
	}
}

export class RegisterPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				<div className="row">
					<div className="col-6 offset-md-3">
						<h2>Register</h2>
						<hr />
						<Login.RegistrationForm />
					</div>
				</div>
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/login">Already have an account? Login</Link></li>
				</ul>
			</div>
		);
	}
}

export class LoginPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				<div className="row">
					<div className="col-6 offset-md-3">
						<h2>Login</h2>
						<hr />
						<Login.LoginForm />
					</div>
				</div>
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/forgot-password">Forgot Password?</Link></li>
					<li><Link to="/register">Create Account</Link></li>
					<li><Link to="/owner">Login Owner Success</Link></li>
					<li><Link to="/user">Login User Success</Link></li>
				</ul>
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
					<li><Link to="/">Home</Link></li>
					<li><Link to="/events/event">Event Details</Link></li>
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
					<li><Link to="/">Home</Link></li>
					<li><Link to="/events">Events</Link></li>
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
					<li><Link to="/">Home</Link></li>
				</ul>
			</div>
		);
	}
}

export class ForgotPasswordPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the forgot password page.

				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/login">Login</Link></li>
				</ul>
			</div>
		);
	}
}

export class ViewProfilePage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the profile view page.

				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/user/edit-user">Edit User</Link></li>
					<li><Link to="/login">Login</Link></li>
				</ul>
			</div>
		);
	}
}

export class EditUserPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the edit profile page.

				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/view-profile">View Profile</Link></li>
				</ul>
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
					<li><Link to="/">Home</Link></li>
					<li><Link to="/food-truck-details">View Truck Details</Link></li>
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
					<li><Link to="/">Home</Link></li>
				</ul>
			</div>
		);
	}
}

export class NotificationsPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the notifications page.

				<ul>
					<li><Link to="/">Home</Link></li>
				</ul>
			</div>
		);
	}
}

export class AboutUsPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the about us page.

				<ul>
					<li><Link to="/">Home</Link></li>
				</ul>
			</div>
		);
	}
}

export class ViewFoodTruckDetailsPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the food truck details page.

				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/search-trucks">New Search</Link></li>
				</ul>
			</div>
		);
	}
}

export class CreateRemoveFoodTruckPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the create or remove food truck page.

				<ul>
					<li><Link to="/owner">Home</Link></li>
				</ul>
			</div>
		);
	}
}

export class EditFoodTruckPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the edit food truck details page.

				<ul>
					<li><Link to="/owner">Home</Link></li>
					<li><Link to="/owner/edit-food-truck/edit-route-schedule">Edit Route/Schedule</Link></li>
				</ul>
			</div>
		);
	}
}

export class EditRouteSchedulePage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the edit food truck route and schedule page.

				<ul>
					<li><Link to="/owner">Home</Link></li>
					<li><Link to="/owner/edit-food-truck">Edit Food Truck</Link></li>
				</ul>
			</div>
		);
	}
}

export class CreateEventPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the create event page.

				<ul>
					<li><Link to="/owner">Home</Link></li>
				</ul>
			</div>
		);
	}
}

export class CreateSpecialPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the create special page.

				<ul>
					<li><Link to="/owner">Home</Link></li>
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

				{ _.isDefined(this.props.authentication) &&
				<div>{this.props.authentication}</div>
				}

				{ _.isDefined(this.props.user) &&
				<div>Welcome, {this.props.user}!</div>
				}
			</div>
		);
	}
}

Page1 = connect(
	state => ({
		authentication: Users.getCookie('authentication'),
		user: Users.getCookie('user')
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

export class HelloSend extends React.Component {
	constructor(props) {
		super(props);
		this.state = {name: 'hello', message: 'hello'};

		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// Set state.name to value in text box
	handleChangeName(event) {
		this.setState({name: event.target.value});
	}

	// Where the axios call occurs
	handleSubmit(event) {
		// Makes sure it is not blank
		event.preventDefault();
		if(this.state.name === '') {
			this.setState({message: 'Must Include a Name'});
			return;
		}

		// Axios call. Header defines the type of call and headers needed
		fetch('/example/hello-receive', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type' : 'application/json',
			},
			// makes the values passed into a JSON value to be passed to backend
			body: JSON.stringify({
				name: this.state.name,
			}),
		}).then(
			// Gets POST promise and converts it to a dictionary
			(response) => response.json()
		).then(
			// Takes interpreted value and extracts value at dictionary entry "name", setting state.message equal to it
			(responseJson) => {
				this.setState({message: responseJson.name});
			}
		).catch((error) => {
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


