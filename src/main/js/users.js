import _ from 'lodash';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'js/backend';
import * as Login from 'js/forms';
import axios from 'axios';
import CustomNavBar from 'js/navBar';

export class HomeUser extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is a user's home page.
				<ul>
					<li>
						<Link to="/help">Help</Link>
					</li>
					<li>
						<Link to="/events">Events</Link>
					</li>
					<li>
						<Link to="/view-profile">View Profile</Link>
					</li>
					<li>
						<Link to="/search-trucks">Search Food Trucks</Link>
					</li>
					<li>
						<Link to="/search-users">Search Users</Link>
					</li>
					<li>
						<Link to="/user/notifications">Notifications</Link>
					</li>
					<li>
						<Link to="/about-free-tank-top">About Us</Link>
					</li>
					<li>
						<Link to="/user">Home</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class ViewUserProfilePage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the user's profile view page.
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/user/edit-user">Edit User</Link>
					</li>
					<li>
						<Link to="/login">Login</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class EditUserPage extends React.Component {
	render() {
		return (
			<div>
				<CustomNavBar />
				\tThis is the edit user's profile page.
			</div>
		);
	}
}
