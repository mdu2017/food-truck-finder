import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import { Multiselect } from 'multiselect-react-dropdown';
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
			foodtypes: [],
			options: [
				'AMERICAN',
				'BBQ',
				'BREAKFAST',
				'CHINESE',
				'DESERT',
				'HEALTHY',
				'INDIAN',
				'MEDITERRANEAN',
				'MEXICAN',
				'PIZZA',
				'SEAFOOD',
				'VEGAN',
				'VEGITARIAN',
				'VIETNAMESE'
			],
			choices: [],
			defaultFoodTypes: JSON.parse(Axios.getCookie('user')).prefFoodTypes,
			defaultDistance: JSON.parse(Axios.getCookie('user')).prefDistance,
			defaultPriceLow: JSON.parse(Axios.getCookie('user')).prefLow,
			defaultPriceHigh: JSON.parse(Axios.getCookie('user')).prefHigh
		};
		console.log(JSON.parse(Axios.getCookie('user')));
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
				id: this.state.id,
				prefDistance: this.state.defaultDistance,
				prefHigh: this.state.defaultPriceHigh,
				prefLow: this.state.defaultPriceLow,
				prefFoodTypes: this.state.choices
			});
			event.preventDefault();
		} else {
			window.alert('Passwords do not match!');
		}
	};

	//Item that is selected.
	onSelect = (optionList, selectedItem) => {
		console.log('Selected item is ' + selectedItem);

		this.setState({
			choices: optionList
		});
	};

	//Item that is removed when using food type filter (*backspace removes index)
	onRemove = (optionList, removedItem) => {
		console.log('removed item is ' + removedItem);

		this.setState({
			choices: optionList
		});
	};

	msDropdown() {
		return (
			<Multiselect
				id={'dashboardMS'}
				options={this.state.options}
				onSelect={this.onSelect} // Function will trigger on select event
				onRemove={this.onRemove} // Function will trigger on remove event
				isObject={false}
				placeholder={'Select Food Types'}
			/>
		);
	}

	renderFavoriteFoodTypes() {
		let render = [];
		this.state.defaultFoodTypes.forEach(type => {
			render.push(<div>{type},</div>);
		});
		if (this.state.defaultFoodTypes.length == 0) {
			render.push(<div>None yet. =(</div>);
		}
		return render;
	}

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
								</span>
								{this.props.user && <h3>{this.props.user}</h3>}

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
									<FormGroup>
										<Label for="newPassword">
											New Password
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
								<span>
									Favorite Food Types:{' '}
									{this.renderFavoriteFoodTypes()}
								</span>

								<span>
									Distance:{' '}
									{this.state.defaultDistance * 70 + ' miles'}
								</span>
								<br />
								<span>
									Price Range: ${this.state.defaultPriceLow} -{' '}
									${this.state.defaultPriceHigh}
								</span>
								<br />
								<br />
								<Form>
									<FormGroup>
										<Label for="foodTypes">
											Food Type(s)
										</Label>
										{this.msDropdown()}
									</FormGroup>
									<FormGroup>
										<Label for="distance">Distance</Label>
										<Input
											type="number"
											min={0}
											name="distance"
											id="distance"
											step="0.01"
											placeholder={
												this.state.defaultDistance *
													70 +
												' miles'
											}
											onChange={e =>
												this.setDefaultDistance(
													e.target.value / 70
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
											placeholder={
												'$' + this.state.defaultPriceLow
											}
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
											placeholder={
												'$' +
												this.state.defaultPriceHigh
											}
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
