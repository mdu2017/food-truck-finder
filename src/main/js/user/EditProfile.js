import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
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
			retpassword: null,
			username: JSON.parse(Axios.getCookie('user')).username,
			owner: JSON.parse(Axios.getCookie('user')).isOwner,
			id: JSON.parse(Axios.getCookie('user')).id
		};
	}

	setPrincipal = principal => this.setState({ principal });
	setPassword = password => this.setState({ password });
	setRetPassword = retpassword => this.setState({ retpassword });

	handleSubmit = event => {
		if (this.state.retpassword == this.state.password) {
			this.props.update({
				principal: this.state.principal,
				password: this.state.password,
				username: this.state.username,
				owner: this.state.owner.toString(),
				id: this.state.id
			});
			event.preventDefault();
		} else {
			window.alert('Passwords do not match!');
		}
	};

	render() {
		return (
			<div>
				<div className="container padded">
					<h1>Manage Account</h1>
					<br />{' '}
					<span href="#" id="UncontrolledTooltipExample">
						Username
					</span>
					:{' '}
					{_.isDefined(this.props.user) && <h3>{this.props.user}</h3>}
					<UncontrolledTooltip
						placement="right"
						target="UncontrolledTooltipExample">
						This cannot be changed!
					</UncontrolledTooltip>
					<br />
					Email:{' '}
					{_.isDefined(this.props.email) && (
						<h3>{this.props.email}</h3>
					)}
					<br />
					<br />
					<Form>
						<FormGroup>
							<Label for="newEmail">New Email </Label>
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
							<Label for="currPassword">
								Current Password
								<span style={{ color: 'red' }}> * </span>
							</Label>
							<Input
								type="password"
								name="currentpassword"
								id="currPassword"
								placeholder=""
							/>
						</FormGroup>
						<FormGroup>
							<Label for="newPassword">
								New Password
								<span style={{ color: 'red' }}> * </span>
							</Label>
							<Input
								type="password"
								name="newpassword"
								id="newPassword"
								placeholder=""
								onChange={e => this.setPassword(e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="retypedPassword">
								New Password (Retyped)
								<span style={{ color: 'red' }}> * </span>
							</Label>
							<Input
								type="password"
								name="retypedPassword"
								id="retypedPassword"
								placeholder=""
								onChange={e =>
									this.setRetPassword(e.target.value)
								}
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
