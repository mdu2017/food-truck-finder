import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
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
			schedule: [
				// {
				// 	day: '',
				// 	stop: [
				// 		{
				// 			startTime: '',
				// 			endTime: '',
				// 			location: [{ lat: '', long: '' }]
				// 		}
				// 	]
				// }
			],
			modal: false
		};
		// Make Dynamic Page
		window.location.href = '/?#/create-food-truck/';
		this.toggle = this.toggle.bind(this);
		this.handleModalSubmit = this.handleModalSubmit.bind(this);
		this.getFoodTypes();
		this.getStatuses();
	}

	setName = name => this.setState({ name });
	setDescription = description => this.setState({ description });
	// setMenu = menu => this.setState({ menu });
	setSchedule = schedule => this.setState({ schedule });
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

	handleModalSubmit = event => {
		this.toggle();
		event.preventDefault();
	};

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

	editStop(index, sTime, eTime, lat, long) {
		let edited = JSON.parse(JSON.stringify(this.state.schedule));
		edited[index].stop.push({
			id: index + this.state.weekdayCounter[index],
			startTime: sTime,
			endTime: eTime,
			location: [{ lat: lat, long: long }]
		});
		this.setState({
			schedule: edited
		});
		{
			console.log(this.state.schedule);
		}
	}

	incrementSchedule(dayOfTheWeek, index) {
		let i = 0;
		if ((dayOfTheWeek == 'Thursday') | (dayOfTheWeek == 'Saturday')) {
			i = 3;
		}
		if (!(index in this.state.schedule)) {
			this.state.schedule.push({
				day: dayOfTheWeek.charAt(i).toUpperCase(),
				stop: [
					// {
					// 	startTime: null,
					// 	endTime: null,
					// 	location: [{ lat: null, long: null }]
					// }
				]
			});
			console.log(this.state.schedule);
		}
	}

	addStopClicked(dayOfTheWeek, index) {
		// Copies array
		const newArray = this.state.weekdayCounter.slice();
		newArray[index] = newArray[index] + 1;
		this.setState({
			weekdayCounter: newArray
		});
	}

	dynamicRender(index) {
		var divList = [];
		for (var j = 0; j < this.state.weekdayCounter[index]; j++) {
			divList.push(<div>{this.displaySchedule('Repeat')}</div>);
		}
		return divList;
	}

	displaySchedule(dayofTheWeek, index) {
		if (Object.keys(this.state.schedule).length < 7) {
			{
				this.incrementSchedule(dayofTheWeek, index);
			}
		}
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
											this.editStop(
												dayofTheWeek,
												e.target.value,
												-1
											)
										}
									/>
									<Label for="EndTime"> - </Label>
									<Input
										type="time"
										name="time"
										id="EndTime"
										onChange={e =>
											this.editStop(
												index,
												-1,
												e.target.value,
												'null',
												'null'
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
								<FormGroup>
									<Input type="checkbox" />
									Closed?
								</FormGroup>
							</Form>
						</Col>
						<Col xs="auto" hidden={dayofTheWeek.includes('Repeat')}>
							<Form inline>
								<FormGroup>
									<Button
										type="submit"
										color="primary"
										size="sm"
										onClick={() =>
											this.addStopClicked(
												dayofTheWeek,
												index
											)
										}>
										Add Stop
									</Button>
								</FormGroup>
							</Form>
						</Col>
					</Row>
				</Container>
				{this.dynamicRender(index)}
			</div>
		);
	}

	render() {
		return (
			<div>
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
					{this.displaySchedule('Sunday', 0)}
					{this.displaySchedule('Monday', 1)}
					{this.displaySchedule('Tuesday', 2)}
					{this.displaySchedule('Wednesday', 3)}
					{this.displaySchedule('Thursday', 4)}
					{this.displaySchedule('Friday', 5)}
					{this.displaySchedule('Saturday', 6)}
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
				.then(function() {
					window.alert('Creation of the Food Truck was successful!');
				})
				// Failed
				.catch(() => window.alert('Creation of the Food Truck failed!'))
	})
)(CreateFoodTruck);
