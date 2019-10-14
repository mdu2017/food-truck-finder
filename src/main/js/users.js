import _ from 'lodash';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'js/backend';
import * as Login from 'js/forms';
import axios from 'axios';
import CustomNavBar from 'js/navBar';
import {
	UncontrolledTooltip,
	Col,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText
} from 'reactstrap';

export class HomeUser extends React.Component {
	render() {
		return (
			<div>
				<CustomNavBar isLoggedIn={true} />
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
							<Link to="/user/view-profile">View Profile</Link>
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
			</div>
		);
	}
}

export class ViewUserProfilePage extends React.Component {
	render() {
		return (
			<div>
				<CustomNavBar isLoggedIn={true} />
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
			</div>
		);
	}
}

export class EditUserPage extends React.Component {
	render() {
		return (
			<div>
				<CustomNavBar />
				<div className="container padded">
					<h1>Manage Account</h1>
					<br />{' '}
					<span
						style={
							{
								// textDecoration: 'underline',
								// color: 'blue'
							}
						}
						href="#"
						id="UncontrolledTooltipExample">
						Username
					</span>
					: Destroyer123
					<UncontrolledTooltip
						placement="right"
						target="UncontrolledTooltipExample">
						This cannot be changed!
					</UncontrolledTooltip>
					<br />
					Email: andrew_case1@baylor.edu
					<br />
					<br />
					<Form>
						<FormGroup>
							<Label for="newEmail">New Email</Label>
							<Input
								type="text"
								name="email"
								id="newEmail"
								placeholder=""
							/>
						</FormGroup>
						<br />
						<FormGroup>
							<Label for="currPassword">Current Password</Label>
							<Input
								type="text"
								name="currentpassword"
								id="currPassword"
								placeholder=""
							/>
						</FormGroup>
						<FormGroup>
							<Label for="newPassword">New Password</Label>
							<Input
								type="text"
								name="newpassword"
								id="newPassword"
								placeholder=""
							/>
						</FormGroup>
						<FormGroup>
							<Label for="retypedPassword">
								New Password (Retyped)
							</Label>
							<Input
								type="text"
								name="retypedPassword"
								id="retypedPassword"
								placeholder=""
							/>
						</FormGroup>
						<Button>Submit</Button>
					</Form>
				</div>
			</div>
		);
	}
}
