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
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';

export class CreateFoodTruck extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: null,
			// menu: null,
			// schedule: null,
			description: null,
			price_low: null,
			price_high: null,
			status: null,
			foodtype: null,
			ownerId: JSON.parse(Axios.getCookie('user')).id,
			weekdayCounter: [0, 0, 0, 0, 0, 0, 0],
			weekdayStops: Array(7)
				.fill(0)
				.map(row => new Array(0)),
			modal: false,
			temp: null
		};
		this.toggle = this.toggle.bind(this);
		this.handleModalSubmit = this.handleModalSubmit.bind(this);
		this.getFoodTypes();
		this.getStatuses();
	}

	setName = name => this.setState({ name });
	setDescription = description => this.setState({ description });
	// setMenu = menu => this.setState({ menu });
	// setSchedule = schedule => this.setState({ schedule });
	setPriceLow = price_low => this.setState({ price_low });
	setPriceHigh = price_high => this.setState({ price_high });
	setStatus = status => this.setState({ status });
	setFoodType = foodtype => this.setState({ foodtype });
	setownerId = ownerId => this.setState({ ownerId });

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
			this.props.createFT({
				name: this.state.name,
				description: this.state.description,
				// menu: this.state.menu,
				// schedule: this.state.schedule,
				price_low: this.state.price_low,
				price_high: this.state.price_high,
				status: this.state.status,
				type: this.state.foodtype,
				ownerId: this.state.ownerId
			});
			event.preventDefault();
		} else {
			window.alert('Error: Price High cannot be lower than Price Low!');
		}
	};

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleModalSubmit(event) {
		this.toggle();
		event.preventDefault();
	}

	// Promise value return
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

	// setState in Axios Call
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

	addStop(dayofTheWeek, type, value) {
		// Remove Repeat to get Day of the week
		if (dayofTheWeek.includes('Repeat')) {
			dayofTheWeek = dayofTheWeek.split('/').pop();
		}
		const newArray = this.state.weekdayStops.slice();
		var time = '';
		if (type == 'ST') {
			this.setState({ temp: value });
		} else if (type == 'ET') {
			if (this.state.temp != null) {
				time = this.state.temp + '-' + value;
				switch (dayofTheWeek) {
					case 'Sunday':
						newArray[0].push(time);
						break;
					case 'Monday':
						newArray[1].push(time);
						break;
					case 'Tuesday':
						newArray[2].push(time);
						break;
					case 'Wednesday':
						newArray[3].push(time);
						break;
					case 'Thursday':
						newArray[4].push(time);
						break;
					case 'Friday':
						newArray[5].push(time);
						break;
					case 'Saturday':
						newArray[6].push(time);
				}
			}
		}
		this.setState({
			weekdayStops: newArray
		});
		console.log(this.state.weekdayStops);
	}

	addStopDisplay(dayofTheWeek) {
		// Copies array
		const newArray = this.state.weekdayCounter.slice();
		switch (dayofTheWeek) {
			case 'Sunday':
				newArray[0] = newArray[0] + 1;
				break;
			case 'Monday':
				newArray[1] = newArray[1] + 1;
				break;
			case 'Tuesday':
				newArray[2] = newArray[2] + 1;
				break;
			case 'Wednesday':
				newArray[3] = newArray[3] + 1;
				break;
			case 'Thursday':
				newArray[4] = newArray[4] + 1;
				break;
			case 'Friday':
				newArray[5] = newArray[5] + 1;
				break;
			case 'Saturday':
				newArray[6] = newArray[6] + 1;
		}
		this.setState({
			weekdayCounter: newArray
		});
	}

	dynamicRender(dayofTheWeek) {
		var divList = [];
		var i = 0;
		switch (dayofTheWeek) {
			case 'Sunday':
				i = 0;
				break;
			case 'Monday':
				i = 1;
				break;
			case 'Tuesday':
				i = 2;
				break;
			case 'Wednesday':
				i = 3;
				break;
			case 'Thursday':
				i = 4;
				break;
			case 'Friday':
				i = 5;
				break;
			case 'Saturday':
				i = 6;
		}
		for (var j = 0; j < this.state.weekdayCounter[i]; j++) {
			divList.push(
				<div>{this.displaySchedule('Repeat/' + dayofTheWeek)}</div>
			);
		}
		return divList;
	}

	displaySchedule(dayofTheWeek) {
		return (
			<div>
				<Container>
					<Row hidden={dayofTheWeek != 'Sunday'}>
						<Col md={{ offset: 1 }}>Time at Location:</Col>
					</Row>
					<Row>
						<Col xs="1">
							<Form
								inline
								hidden={dayofTheWeek.includes('Repeat')}>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									{dayofTheWeek}
								</FormGroup>
							</Form>
						</Col>
						<Col xs="auto">
							<Form inline>
								<FormGroup className="text-center">
									<Input
										type="time"
										name="time"
										id="StartTime"
										onChange={e =>
											this.addStop(
												dayofTheWeek,
												'ST',
												e.target.value
											)
										}
									/>
									<Label for="EndTime"> - </Label>
									<Input
										type="time"
										name="time"
										id="EndTime"
										onChange={e =>
											this.addStop(
												dayofTheWeek,
												'ET',
												e.target.value
											)
										}
									/>
								</FormGroup>
							</Form>
						</Col>
						<Col xs="auto">
							<Form inline>
								<FormGroup>
									<Button
										outline
										color="primary"
										onClick={this.toggle}>
										Location
									</Button>
								</FormGroup>
							</Form>
						</Col>
						<Col xs="auto">
							<Form inline>
								<FormGroup
									hidden={dayofTheWeek.includes('Repeat')}>
									<Input type="checkbox" />
									Closed?
								</FormGroup>
							</Form>
						</Col>
						<Col xs="auto">
							<Form inline>
								<FormGroup>
									<Button
										type="submit"
										hidden={dayofTheWeek.includes('Repeat')}
										color="primary"
										size="sm"
										onClick={() => {
											this.addStopDisplay(dayofTheWeek);
										}}>
										Add Stop
									</Button>
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
					<h1>Create a Food Truck</h1>
					<br />
					<Form>
						<FormGroup>
							<Label for="ftName">Name</Label>
							<Input
								type="text"
								name="name"
								id="ftName"
								placeholder="Name of Food Truck"
								onChange={e => this.setName(e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="statuses">Current Status</Label>
							<Input
								type="select"
								name="status"
								id="statuses"
								onChange={e => this.setStatus(e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="foodTypes">Food Type</Label>
							<Input
								type="select"
								name="foodtype"
								id="foodTypes"
								onChange={e => this.setFoodType(e.target.value)}
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
								onChange={e => this.setPriceLow(e.target.value)}
							/>
						</FormGroup>
						<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
							<Label for="ftHighPrice" className="mr-sm-2">
								Price High
							</Label>
							<Input
								type="number"
								min={0}
								name="price"
								id="ftHighPrice"
								step="0.01"
								onChange={e =>
									this.setPriceHigh(e.target.value)
								}
							/>
						</FormGroup>
					</Form>
					<Form>
						<FormGroup>
							<Label for="ftDescription">Description</Label>
							<Input
								type="textarea"
								name="description"
								id="ftDescription"
								placeholder="(Optional) Will be displayed on the Food Truck's page. Limited to 200 characters."
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
							<Input type="file" name="menu" id="ftMenu" />
							<FormText color="muted">
								This is some placeholder block-level help text
								for the above input. It's a bit lighter and
								easily wraps to a new line.
							</FormText>
						</FormGroup>
					</Form>
					<legend>Schedule</legend>
					{this.displaySchedule('Sunday')}
					{this.dynamicRender('Sunday')}
					{this.displaySchedule('Monday')}
					{this.dynamicRender('Monday')}
					{this.displaySchedule('Tuesday')}
					{this.dynamicRender('Tuesday')}
					{this.displaySchedule('Wednesday')}
					{this.dynamicRender('Wednesday')}
					{this.displaySchedule('Thursday')}
					{this.dynamicRender('Thursday')}
					{this.displaySchedule('Friday')}
					{this.dynamicRender('Friday')}
					{this.displaySchedule('Saturday')}
					{this.dynamicRender('Saturday')}
					<Button onClick={this.handleSubmit}>Submit</Button>
				</div>
				<div>
					<Modal isOpen={this.state.modal}>
						<form onSubmit={this.handleModalSubmit}>
							<ModalHeader>Google Maps</ModalHeader>
							<ModalBody>Where map will go...</ModalBody>
							<ModalFooter>
								<input
									type="submit"
									value="Submit"
									color="primary"
									className="btn btn-primary"
								/>
								<Button color="danger" onClick={this.toggle}>
									Cancel
								</Button>
							</ModalFooter>
						</form>
					</Modal>
				</div>
			</div>
		);
	}
}
CreateFoodTruck = connect(
	() => ({}),
	dispatch => ({
		createFT: foodTruck =>
			dispatch(Axios.Actions.createFT(foodTruck))
				// Success
				.then(function(result) {
					window.alert('Creation of the Food Truck was successful!');
				})
				// Failed
				.catch(error =>
					window.alert('Creation of the Food Truck failed!')
				)
	})
)(CreateFoodTruck);

export class ModalComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = { modal: false, name: '', team: '', country: '' };

		this.toggle = this.toggle.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleSubmit(event) {
		console.log('this');
		this.toggle();
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<Button color="success" onClick={this.toggle}>
					React Modal
				</Button>
				<Modal isOpen={this.state.modal}>
					<form onSubmit={this.handleSubmit}>
						<ModalHeader>IPL 2018</ModalHeader>
						<ModalBody></ModalBody>
						<ModalFooter>
							<input
								type="submit"
								value="Submit"
								color="primary"
								className="btn btn-primary"
							/>
							<Button color="danger" onClick={this.toggle}>
								Cancel
							</Button>
						</ModalFooter>
					</form>
				</Modal>
			</div>
		);
	}
}
