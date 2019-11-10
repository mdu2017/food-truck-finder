import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
	Container,
	Col,
	Row
} from 'reactstrap';

export class EditFoodTruck extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			name: null,
			description: null,
			// menu: null,
			// schedule: null,
			price_low: null,
			price_high: null,
			status: null,
			foodtype: null,
			truck: null,
			ownerId: JSON.parse(Axios.getCookie('user')).id
		};
	}

	setID = id => this.setState({ id });
	setName = name => this.setState({ name });
	setDescription = description => this.setState({ description });
	// setMenu = menu => this.setState({ menu });
	// setSchedule = schedule => this.setState({ schedule });
	setPriceLow = price_low => this.setState({ price_low });
	setPriceHigh = price_high => this.setState({ price_high });
	setStatus = status => this.setState({ status });
	setFoodType = foodtype => this.setState({ foodtype });

	handleSubmit = event => {
		// The price_high is not lower than price_low
		if (this.state.price_high >= this.state.price_low) {
			// Check if Prices are lower than zero
			if (this.state.price_low < 0) {
				this.state.price_low = 0;
			}
			if (this.state.price_high < 0) {
				this.state.price_high = 0;
			}
			this.props.editTruck({
				id: this.state.id,
				name: this.state.name,
				description: this.state.description,
				// menu: this.state.menu,
				// schedule: this.state.schedule,
				price_low: this.state.price_low,
				price_high: this.state.price_high,
				status: this.state.status,
				foodtype: this.state.foodtype,
				ownerId: this.state.ownerId
			});
			event.preventDefault();
		} else {
			window.alert('Error: Price High cannot be lower than Price Low!');
		}
	};

	handleRemoveTruck = event => {
		this.props.removeTruck({
			truck_id: this.state.id
		});
		event.preventDefault();
	};

	componentWillMount() {
		const URLObject = this.props.match.params;
		// Object Destruction
		var { foodtruckId: id } = URLObject;
		Axios.getFoodTruckDetails(id).then(result => {
			this.setState({ id: result.id });
			this.setState({ name: result.name });
			this.setState({ price_low: result.price_low });
			this.setState({ price_high: result.price_high });
			this.setState({ truck: result });
			// Fix Reload issue
			window.parent.location = window.parent.location.href;
		});
		this.getFoodTypes();
		this.getStatuses();
	}

	getFoodTypes() {
		var self = this;
		Axios.getFoodTypes().then(function(result) {
			self.setState({ foodtype: result[0] });
			var str = '';
			result.forEach(function(type) {
				str += '<option>' + type + '</option>';
			});
			document.getElementById('foodTypes').innerHTML = str;
		});
	}

	getStatuses() {
		var self = this;
		Axios.getStatuses().then(function(result) {
			self.setState({ status: result[0] });
			var str = '';
			result.forEach(function(status) {
				str += '<option>' + status + '</option>';
			});
			document.getElementById('statuses').innerHTML = str;
		});
	}

	displayDayOfTheWeek(dayofTheWeek) {
		return (
			<div>
				<Container>
					<Row>
						<Col xs="auto">
							<Form inline>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Input type="checkbox" />
									{dayofTheWeek}
								</FormGroup>
								<FormGroup>
									<Input
										type="time"
										name="time"
										id="StartTime"
									/>
									<Label for="EndTime"> - </Label>
									<Input
										type="time"
										name="time"
										id="EndTime"
									/>
								</FormGroup>
							</Form>
						</Col>
						<Col>
							<Form inline>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Input
										type="number"
										min={0}
										name="latitude"
										id="latitude"
										placeholder="latitude"
										step="0.01"
									/>
								</FormGroup>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Input
										type="number"
										min={0}
										name="longitude"
										id="longitude"
										placeholder="longitude"
										step="0.01"
									/>
								</FormGroup>
							</Form>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					{this.state.truck ? (
						<div>
							<h1>Editing Truck: {this.state.truck.name}</h1>
							<br />
							<Form>
								<FormGroup>
									<Label for="ftName">Name</Label>
									<Input
										type="text"
										name="name"
										id="ftName"
										placeholder={this.state.truck.name}
										onChange={e =>
											this.setName(e.target.value)
										}
									/>
								</FormGroup>
								<FormGroup>
									<Label for="statuses">Current Status</Label>
									<Input
										type="select"
										name="status"
										id="statuses"
										onChange={e =>
											this.setStatus(e.target.value)
										}
									/>
								</FormGroup>
								<FormGroup>
									<Label for="foodTypes">Food Type</Label>
									<Input
										type="select"
										name="foodtype"
										id="foodTypes"
										onChange={e =>
											this.setFoodType(e.target.value)
										}
									/>
								</FormGroup>
							</Form>
							<Form inline>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Label for="ftLowPrice" className="mr-sm-2">
										Price Low
									</Label>
									<Input
										type="number"
										min={0}
										name="price"
										id="ftLowPrice"
										step="0.01"
										placeholder={this.state.truck.price_low}
										onChange={e =>
											this.setPriceLow(e.target.value)
										}
									/>
								</FormGroup>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Label
										for="ftHighPrice"
										className="mr-sm-2">
										Price High
									</Label>
									<Input
										type="number"
										min={0}
										name="price"
										id="ftHighPrice"
										step="0.01"
										placeholder={
											this.state.truck.price_high
										}
										onChange={e =>
											this.setPriceHigh(e.target.value)
										}
									/>
								</FormGroup>
							</Form>
							<Form>
								<FormGroup>
									<Label for="ftDescription">
										Description
									</Label>
									<Input
										type="textarea"
										name="description"
										id="ftDescription"
										placeholder="(Optional) Will be displayed on the Food Truck's page"
										onChange={e =>
											this.setDescription(e.target.value)
										}
									/>
								</FormGroup>
								<FormGroup>
									<legend>Menu</legend>
									<Label for="ftMenu" hidden>
										Menu
									</Label>
									<Input
										type="file"
										name="menu"
										id="ftMenu"
									/>
									<FormText color="muted">
										This is some placeholder block-level
										help text for the above input. It's a
										bit lighter and easily wraps to a new
										line.
									</FormText>
								</FormGroup>
							</Form>
						</div>
					) : null}
					<legend>Schedule / Route</legend>
					{this.displayDayOfTheWeek('Sunday')}
					{this.displayDayOfTheWeek('Monday')}
					{this.displayDayOfTheWeek('Tuesday')}
					{this.displayDayOfTheWeek('Wednesday')}
					{this.displayDayOfTheWeek('Thursday')}
					{this.displayDayOfTheWeek('Friday')}
					{this.displayDayOfTheWeek('Saturday')}
					<Button onClick={this.handleSubmit}>Submit</Button>{' '}
					<Button color="danger" onClick={this.handleRemoveTruck}>
						Delete Food Truck
					</Button>
				</div>
			</div>
		);
	}
}
EditFoodTruck = connect(
	() => ({}),
	dispatch => ({
		editTruck: foodTruck => dispatch(Axios.Actions.saveFoodFT(foodTruck)),
		removeTruck: truck_id =>
			dispatch(Axios.Actions.removeFoodFT(truck_id)).then(function(
				result
			) {
				if (result) {
					window.location.href = '/#/list-food-trucks';
					window.alert('Deletion was successful!');
				} else {
					window.alert('Deletion was NOT successful!');
				}
			})
	})
)(EditFoodTruck);
