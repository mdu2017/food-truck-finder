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
	FormText,
	Row,
	Nav,
	NavItem,
	NavLink,
	Container
} from 'reactstrap';
import { State } from './backend';

export class HomeUser extends React.Component {
	render() {
		return (
			<div>
				<CustomNavBar />
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

	displayUsername() {
		if (this.state.authentication) {
			return this.state.username;
		}
		return null;
	}

	render() {
		return (
			<div>
				<CustomNavBar />
				<div className="container padded">
					<h1>View Profile</h1>
					<Container>
						<Row>
							<Col xs="3">
								<p>Quick Links</p>
								<hr />
								<Nav vertical>
									<NavItem>
										<NavLink href="/">Dashboard</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href="/events">Events</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											disabled={
												!this.state.authentication
											}
											href="/user/notifications">
											Notifications
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink disabled href="/search-trucks">
											Search Food Trucks
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink disabled href="/search-users">
											Search Users
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink
											disabled
											href="/about-free-tank-top">
											About Us
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href="/page-1">Page 1</NavLink>
									</NavItem>
								</Nav>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		);
	}
}

export class EditUserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			principal: Users.getCookie('email'),
			password: Users.getCookie('password'),
			username: Users.getCookie('user'),
			owner: Users.getCookie('owner'),
			id: Users.getCookie('userid')
		};
	}

	setPrincipal = principal => this.setState({ principal });
	setPassword = password => this.setState({ password });

	handleSubmit = event => {
		this.props.update({
			principal: this.state.principal,
			password: this.state.password,
			username: this.state.username,
			owner: this.state.owner.toString(),
			id: this.state.id
		}); // Add registration
		event.preventDefault();
	};

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
					:{' '}
					{_.isDefined(this.props.user) && (
						<text>{this.props.user}</text>
					)}
					<UncontrolledTooltip
						placement="right"
						target="UncontrolledTooltipExample">
						This cannot be changed!
					</UncontrolledTooltip>
					<br />
					Email:{' '}
					{_.isDefined(this.props.email) && (
						<text>{this.props.email}</text>
					)}
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
								onChange={e =>
									this.setPrincipal(e.target.value)
								}
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
								onChange={e => this.setPassword(e.target.value)}
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
						<Button onClick={this.handleSubmit}>Submit</Button>
					</Form>
				</div>
			</div>
		);
	}
}

EditUserPage = connect(
	() => ({
		authentication: Users.getCookie('authentication'),
		user: Users.getCookie('user'),
		email: Users.getCookie('email')
	}),
	dispatch => ({
		update: user => dispatch(Users.Actions.update(user))
	})
)(EditUserPage);
