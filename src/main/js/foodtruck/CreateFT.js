import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {
	Button,
	Col,
	Container,
	Form,
	FormGroup,
	FormText,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row
} from 'reactstrap';
import MapContainer from 'js/Maps';

export class CreateFoodTruck extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: null,
			// menu: null,
			description: null,
			price_low: 0,
			price_high: 10,
			status: null,
			foodtype: null,
			ownerId: JSON.parse(Axios.getCookie('user')).id,
			schedule: [
				{
					day: 'S',
					startTime: null,
					endTime: null,
					lat: null,
					log: null
				}
			],
			selectedLatitude: 0,
			selectedLongitude: 0,
			buttonVisibility: true,
			modal: false,
			statuses: [],
			foodtypes: []
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
		// Check if Prices are lower than zero
		if (this.state.price_low < 0) {
			this.state.price_low = 0;
		}
		if (this.state.price_high < 0) {
			this.state.price_high = 0;
		}
		// The price_high is not lower than price_low
		if (this.state.price_high >= this.state.price_low) {
			this.props.createFT({
				name: this.state.name,
				description: this.state.description,
				// menu: this.state.menu,
				schedFE: this.state.schedule,
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
		this.setState({ buttonVisibility: !this.state.buttonVisibility });
		event.preventDefault();
	};

	// Promise value return
	getFoodTypes() {
		Axios.getFoodTypes().then(result => {
			this.setState({ foodtypes: result, foodtype: result[0] });
		});
	}

	getStatuses() {
		var self = this;
		Axios.getStatuses().then(result => {
			self.setState({ statuses: result, status: result[0] });
		});
	}

	handleStartTimeScheduleChange = idx => evt => {
		const newSchedule = this.state.schedule.map((schedule, sidx) => {
			if (idx !== sidx) return schedule;
			return {
				...schedule,
				startTime: evt.target.value
			};
		});
		this.setState({ schedule: newSchedule });
		// console.log(JSON.stringify(newSchedule));
		console.log(newSchedule);
	};

	handleEndTimeScheduleChange = idx => evt => {
		const newSchedule = this.state.schedule.map((schedule, sidx) => {
			if (idx !== sidx) return schedule;
			return {
				...schedule,
				endTime: evt.target.value
			};
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
		console.log(JSON.stringify(newSchedule));
		console.log(newSchedule);
	};

	handleLocationChange = idx => evt => {
		this.setState({ buttonVisibility: !this.state.buttonVisibility });
		const newSchedule = this.state.schedule.map((schedule, sidx) => {
			if (idx !== sidx) return schedule;
			return {
				...schedule,
				log: this.state.selectedLongitude,
				lat: this.state.selectedLatitude
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
					startTime: null,
					endTime: null,
					lat: null,
					log: null
				}
			])
		});
	}

	handleMapSelection(latitude, longitude) {
		this.setState({ selectedLatitude: latitude });
		this.setState({ selectedLongitude: longitude });
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
							>
								{this.state.statuses.map((status, index) => (
									<option key={index}>{status}</option>
								))}
							</Input>
						</FormGroup>
						<FormGroup>
							<Label for="foodTypes">Food Type</Label>
							<Input
								type="select"
								name="foodtype"
								id="foodTypes"
								onChange={e => this.setFoodType(e.target.value)}
							>
								{this.state.foodtypes.map((foodtype, index) => (
									<option key={index}>{foodtype}</option>
								))}
							</Input>
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
												<span>
													{'Stop '}
													{idx + 1}
													{': '}
												</span>
												<Input
													required
													type="select"
													name="DotW"
													id="DotW"
													onChange={this.handleDayScheduleChange(
														idx
													)}
												>
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
													hidden={
														!this.state
															.buttonVisibility
													}
													color="primary"
													id="AddLocation"
													onClick={this.toggle}
												>
													Add Location
												</Button>
												<Button
													hidden={
														this.state
															.buttonVisibility
													}
													outline
													color="primary"
													onClick={this.handleLocationChange(
														idx
													)}
												>
													Confirm Location for Stop{' '}
													{idx + 1} ?
												</Button>
												<Input
													disabled
													hidden={
														this.state
															.buttonVisibility
													}
													type="number"
													name="latitude"
													id="latitude"
													value={
														this.state
															.selectedLatitude
													}
												/>
												<Input
													disabled
													hidden={
														this.state
															.buttonVisibility
													}
													type="number"
													name="longitude"
													id="longitude"
													value={
														this.state
															.selectedLongitude
													}
												/>
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
									hidden={!this.state.buttonVisibility}
									color="primary"
									size="sm"
									onClick={() => this.handleAddStop()}
								>
									Add Stop
								</Button>
							</FormGroup>
						</Form>
					</Col>

					<Button onClick={this.handleSubmit}>Create Truck</Button>
				</div>
				<div>
					{this.state.schedule.map(schedule => (
						<div className="schedule">
							<Modal
								isOpen={this.state.modal}
								size="lg"
								scrollable="true"
								style={{ height: '400px', width: '425px' }}
							>
								<form onSubmit={this.handleModalSubmit}>
									<ModalHeader>Google Maps</ModalHeader>
									<ModalBody
										style={{
											height: '400px',
											width: '600px'
										}}
									>
										<MapContainer
											handleMapSelection={this.handleMapSelection.bind(
												this
											)}
										/>
									</ModalBody>
									<ModalFooter>
										<input
											type="submit"
											value="Submit"
											color="primary"
											className="btn btn-primary"
										/>
										<Button
											color="danger"
											onClick={this.toggle}
										>
											Cancel
										</Button>
									</ModalFooter>
								</form>
							</Modal>
						</div>
					))}
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
					window.location.href = '/#/list-food-trucks';
					window.alert('Creation of the Food Truck was successful!');
				})
				// Failed
				.catch(() => window.alert('Creation of the Food Truck failed!'))
	})
)(CreateFoodTruck);
