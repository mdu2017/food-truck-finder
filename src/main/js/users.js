import _ from 'lodash';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'js/backend';
import * as Login from 'js/forms';
import axios from 'axios';
import * as NavBars from 'js/navBar';
import {
	UncontrolledTooltip,
	Col,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Row,
	Nav,
	NavItem,
	NavLink,
	Container
} from 'reactstrap';

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

	isOwner() {
		if (this.state.owner == 'true') {
			return 'Owner';
		}
		return 'Customer';
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>View Profile</h1>
					<Container>
						<Row>
							<Col>
								<h2>Account Details</h2>
								<h6>Username: {this.state.username}</h6>
								<h6>Email: {this.state.principal}</h6>
								<h6>Account Type: {this.isOwner()}</h6>
							</Col>
							<Col>
								<h2>Ratings {'&'} Reviews</h2>
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
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Manage Account</h1>
					<br />{' '}
					<span
						// style={
						// 	{
						// 		// textDecoration: 'underline',
						// 		// color: 'blue'
						// 	}
						// }
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
