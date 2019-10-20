import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {
	UncontrolledTooltip,
	Button,
	Form,
	FormGroup,
	Label,
	Input
} from 'reactstrap';

export class EditProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			principal: JSON.parse(Axios.getCookie('user')).principal,
			password: null,
			username: JSON.parse(Axios.getCookie('user')).username,
			owner: JSON.parse(Axios.getCookie('user')).isOwner,
			id: JSON.parse(Axios.getCookie('user')).id
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
								placeholder={this.state.principal}
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

EditProfile = connect(
	() => ({
		user: JSON.parse(Axios.getCookie('user')).username,
		email: JSON.parse(Axios.getCookie('user')).principal
	}),
	dispatch => ({
		update: user => dispatch(Axios.Actions.update(user))
	})
)(EditProfile);
