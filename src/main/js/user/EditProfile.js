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
	Input,
	Container,
	Row,
	Col
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
			id: JSON.parse(Axios.getCookie('user')).id,
			defaultDistance: null, // TODO: Set this user preferences
			defaultPriceLow: null,
			defaultPriceHigh: null
		};
	}

	setPrincipal = principal => this.setState({ principal });
	setPassword = password => this.setState({ password });
	setRetPassword = retpassword => this.setState({ retpassword });
	setDefaultDistance = defaultDistance => this.setState({ defaultDistance });
	setDefaultPriceLow = defaultPriceLow => this.setState({ defaultPriceLow });
	setDefaultPriceHigh = defaultPriceHigh =>
		this.setState({ defaultPriceHigh });

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
				<NavBars.CustomNavBar />
				<div className="container padded">
					<Container>
						<Row>
							<Col>
								<h2>Edit Account</h2>
								<span id="UncontrolledTooltipExample">
									Username:{' '}
									<UncontrolledTooltip
										placement="right"
										target="UncontrolledTooltipExample"
									>
										This cannot be changed!
									</UncontrolledTooltip>
									{this.props.user && (
										<h3>{this.props.user}</h3>
									)}
								</span>
								<br />
								<span>
									Email:{' '}
									{this.props.email && (
										<h3>{this.props.email}</h3>
									)}
								</span>
								<Form>
									<FormGroup>
										<Label for="newEmail">New Email </Label>
										<Input
											type="text"
											name="email"
											id="newEmail"
											placeholder={this.state.principal}
											onChange={e =>
												this.setPrincipal(
													e.target.value
												)
											}
										/>
									</FormGroup>
									<br />
									<FormGroup>
										<Label for="currPassword">
											Current Password
											<span style={{ color: 'red' }}>
												{' '}
												*{' '}
											</span>
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
											<span style={{ color: 'red' }}>
												{' '}
												*{' '}
											</span>
										</Label>
										<Input
											type="password"
											name="newpassword"
											id="newPassword"
											placeholder=""
											onChange={e =>
												this.setPassword(e.target.value)
											}
										/>
									</FormGroup>
									<FormGroup>
										<Label for="retypedPassword">
											New Password (Retyped)
											<span style={{ color: 'red' }}>
												{' '}
												*{' '}
											</span>
										</Label>
										<Input
											type="password"
											name="retypedPassword"
											id="retypedPassword"
											placeholder=""
											onChange={e =>
												this.setRetPassword(
													e.target.value
												)
											}
										/>
									</FormGroup>
									<Button
										onClick={this.handleSubmit}
										color="primary"
									>
										Submit
									</Button>
								</Form>
							</Col>
							<Col>
								<h2>Edit Preferences</h2>
								<span>Favorite Food Types:</span>
								<br />
								<span>??</span>
								<br />
								<span>Distance:</span>
								<br />
								<span>Price Range: ? - ?</span>
								<br />
								<br />
								<Form>
									<FormGroup>
										<Label for="foodTypes">
											Food Type(s)
										</Label>
										<Input
											type="select"
											name="foodtype"
											id="foodTypes"
											onChange={e =>
												this.setFoodType(e.target.value)
											}
										/>
									</FormGroup>
									<FormGroup>
										<Label for="distance">Distance</Label>
										<Input
											type="number"
											min={0}
											name="distance"
											id="distance"
											step="0.01"
											placeholder="35.0"
											onChange={e =>
												this.setDefaultDistance(
													e.target.value
												)
											}
										/>
									</FormGroup>
									<FormGroup>
										<Label for="priceLow">Price Low</Label>
										<Input
											type="number"
											min={0}
											name="priceLow"
											id="priceLow"
											step="0.01"
											placeholder="35.0"
											onChange={e =>
												this.setDefaultPriceLow(
													e.target.value
												)
											}
										/>
									</FormGroup>
									<FormGroup>
										<Label for="priceHigh">
											Price High
										</Label>
										<Input
											type="number"
											min={0}
											name="priceHigh"
											id="priceHigh"
											step="0.01"
											placeholder="35.0"
											onChange={e =>
												this.setDefaultPriceHigh(
													e.target.value
												)
											}
										/>
									</FormGroup>
								</Form>
							</Col>
						</Row>
					</Container>
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
