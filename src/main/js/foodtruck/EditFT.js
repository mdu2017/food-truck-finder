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
	Row,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter
} from 'reactstrap';
import MapContainer from 'js/Maps';

export class EditFoodTruck extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			name: null,
			description: null,
			// menu: null,
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
			price_low: null,
			price_high: null,
			status: null,
			foodtype: null,
			truck: null,
			modal: false,
			ownerId: JSON.parse(Axios.getCookie('user')).id,
			foodtypes: [],
			statuses: []
		};
		this.toggle = this.toggle.bind(this);
		this.handleModalSubmit = this.handleModalSubmit.bind(this);
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

	//Handle event when form is submitted
	handleSubmit = event => {

		//Non-zero values for prices
		if (this.state.price_low < 0) {
			this.state.price_low = 0;
		}
		if (this.state.price_high < 0) {
			this.state.price_high = 0;
		}

		// The price_high is not lower than price_low
		if (Number(this.state.price_high) >= Number(this.state.price_low)) {


			//Axios call to edit food truck
			this.props.editTruck({
				id: this.state.id,
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

	//When component mounts (first loads)
	componentDidMount() {
		const URLObject = this.props.match.params;

		// Object Destruction
		var { foodtruckId: id } = URLObject;
		Axios.getFoodTruckDetails(id).then(result => {
			this.setState({
				id: result.id,
				name: result.name,
				price_low: result.price_low,
				price_high: result.price_high,
				truck: result,
				foodtype: result.type,
				status: result.status
			});
		});
		this.getFoodTypes();
		this.getStatuses();
	}

	//Toggle modal for schedule
	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	//Handler for submitting modal form
	handleModalSubmit = event => {
		this.toggle();
		this.setState({ buttonVisibility: !this.state.buttonVisibility });
		event.preventDefault();
	};

	//Return all food types
	getFoodTypes() {
		Axios.getFoodTypes().then(result => {
			this.setState({ foodtypes: result });
		});
	}

	//Return all statuses
	getStatuses() {
		var self = this;
		Axios.getStatuses().then(result => {
			self.setState({ statuses: result });
		});
	}

	//Handler to remove truck from database
	handleRemoveTruck = event => {
		this.props.removeTruck({
			truck_id: this.state.id
		});
		event.preventDefault();
	};

	//Handler for adjusting start time of schedule
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

	//Handler for adjusting end time of schedule
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

	//Handler for adjusting day of schedule
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

	//Handler for adjusting location of schedule
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

	//Handler for adding of schedule
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

	//Handler for adding location on map
	handleMapSelection(latitude, longitude) {
		this.setState({ selectedLatitude: latitude });
		this.setState({ selectedLongitude: longitude });
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
										value={this.state.status}
										onChange={e =>
											this.setStatus(e.target.value)
										}
									>
										{this.state.statuses.map(
											(status, index) => (
												<option key={index}>
													{status}
												</option>
											)
										)}
									</Input>
								</FormGroup>
								<FormGroup>
									<Label for="foodTypes">Food Type</Label>
									<Input
										type="select"
										value={this.state.foodtype}
										onChange={e =>
											this.setFoodType(e.target.value)
										}
									>
										{this.state.foodtypes.map(
											(foodtype, index) => (
												<option key={index}>
													{foodtype}
												</option>
											)
										)}
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
										placeholder={this.state.truck.price_low}
										onChange={e =>
											this.setPriceLow(e.target.value)
										}
									/>
								</FormGroup>
								<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
									<Label
										for="ftHighPrice"
										className="mr-sm-2"
									>
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
					<Button onClick={this.handleSubmit}>Submit</Button>{' '}
					<Button color="danger" onClick={this.handleRemoveTruck}>
						Delete Food Truck
					</Button>
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
			</div>
		);
	}
}
EditFoodTruck = connect(
	() => ({}),
	dispatch => ({
		editTruck: foodTruck => dispatch(Axios.Actions.createFoodTruck(foodTruck)),
		removeTruck: truck_id =>
			dispatch(Axios.Actions.removeFoodFT(truck_id)).then(function(
				result
			) {
				if (result) {
					console.log(result);
					window.location.href = '/#/list-food-trucks';
					window.alert('Deletion was successful!');
				} else {
					console.log(result);
					window.alert('Deletion was NOT successful!');
				}
			})
	})
)(EditFoodTruck);
