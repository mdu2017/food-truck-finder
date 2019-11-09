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
			description: null,
			price_low: null,
			price_high: null,
			status: null,
			foodtype: null,
			ownerId: JSON.parse(Axios.getCookie('user')).id,
			schedule: [
				{
					day: 'S',
					stop: [
						{
							startTime: null,
							endTime: null,
							location: [{ lat: null, long: null }]
						}
					]
				}
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
			// this.consolidateSchedule();
			// console.log(this.state.schedule);
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

	// consolidateSchedule() {
	// 	let newSchedule = this.state.schedule;
	// 	for (let i = 0; i < Object.keys(newSchedule).length; i++) {
	// 		for (let j = i; j >= 0; j--) {
	// 			if (i != j && newSchedule[i].day == newSchedule[j].day) {
	// 				console.log('i' + i);
	// 				console.log('j' + j);
	// 				newSchedule[i].stop[i].concat([
	// 					{
	// 						startTime: newSchedule[j].stop[j].startTime,
	// 						endTime: newSchedule[j].stop[j].endTime,
	// 						location: [
	// 							{
	// 								lat: newSchedule[j].stop[j].lat,
	// 								long: newSchedule[j].stop[j].long
	// 							}
	// 						]
	// 					}
	// 				]);
	// 			}
	// 		}
	// 	}
	// 	this.setState({ schedule: newSchedule });
	// }

	handleStartTimeScheduleChange = idx => evt => {
		const newSchedule = this.state.schedule.map((schedule, sidx) => {
			if (idx !== sidx) return schedule;
			const newStop = schedule.stop.map((stop, idx) => {
				return { ...stop, startTime: evt.target.value };
			});
			return { ...schedule, stop: newStop };
		});
		this.setState({ schedule: newSchedule });
		// console.log(JSON.stringify(newSchedule));
		console.log(newSchedule);
	};

	handleEndTimeScheduleChange = idx => evt => {
		const newSchedule = this.state.schedule.map((schedule, sidx) => {
			if (idx !== sidx) return schedule;
			const newStop = schedule.stop.map((stop, idx) => {
				return { ...stop, endTime: evt.target.value };
			});
			return { ...schedule, stop: newStop };
		});
		this.setState({ schedule: newSchedule });
		// console.log(JSON.stringify(newSchedule));
		console.log(newSchedule);
	};

	handleDayScheduleChange = idx => evt => {
		const newSchedule = this.state.schedule.map((schedule, sidx) => {
			if (idx !== sidx) return schedule;
			return {
				...schedule,
				day: evt.target.value
			};
		});
		this.setState({ schedule: newSchedule });
		// console.log(JSON.stringify(newSchedule));
		console.log(newSchedule);
	};

	handleAddStop() {
		this.setState({
			schedule: this.state.schedule.concat([
				{
					day: 'S',
					stop: [
						{
							startTime: null,
							endTime: null,
							location: [{ lat: null, long: null }]
						}
					]
				}
			])
		});
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
					<FormText color="muted">
						If no time is selected for an individual day, it is
						assumed to be closed.
					</FormText>
					<Container>
						<Row>
							<Col md={{ offset: 3 }}>Time at Location:</Col>
						</Row>
						{this.state.schedule.map((schedule, idx) => (
							<div className="schedule">
								<Row>
									<Col xs="auto">
										<Form inline>
											<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
												<Input
													required
													type="select"
													name="DotW"
													id="DotW"
													onChange={this.handleDayScheduleChange(
														idx
													)}>
													<option value="S">
														Sunday
													</option>
													<option value="M">
														Monday
													</option>
													<option value="T">
														Tuesday
													</option>
													<option value="W">
														Wednesday
													</option>
													<option value="R">
														Thursday
													</option>
													<option value="F">
														Friday
													</option>
													<option value="U">
														Saturday
													</option>
												</Input>
											</FormGroup>
										</Form>
									</Col>
									<Col xs="auto">
										<Form inline>
											<FormGroup className="text-center">
												<Input
													required
													type="time"
													name="time"
													id="StartTime"
													onChange={this.handleStartTimeScheduleChange(
														idx
													)}
												/>
												<Label for="EndTime"> - </Label>
												<Input
													required
													type="time"
													name="time"
													id="EndTime"
													onChange={this.handleEndTimeScheduleChange(
														idx
													)}
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
								</Row>
							</div>
						))}
					</Container>
					<Col sm="12" md={{ size: 6, offset: 2 }}>
						<Form inline>
							<FormGroup>
								<Button
									type="submit"
									color="primary"
									size="sm"
									onClick={() => this.handleAddStop()}>
									Add Stop
								</Button>
							</FormGroup>
						</Form>
					</Col>

					<Button onClick={this.handleSubmit}>Create Truck</Button>
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
