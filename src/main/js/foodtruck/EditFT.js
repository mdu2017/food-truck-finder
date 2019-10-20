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
			name: null,
			menu: null,
			schedule: null,
			price: null,
			status: null,
			foodtype: null,
			truck: null
		};
	}

	setName = name => this.setState({ name });
	setMenu = menu => this.setState({ menu });
	setSchedule = schedule => this.setState({ schedule });
	setPrice = price => this.setState({ price });
	setStatus = status => this.setState({ status });
	setFoodType = type => this.setState({ type });

	componentWillMount() {
		const URLObject = this.props.match.params;
		// Object Destruction
		var { foodtruckId: id } = URLObject;
		Axios.getFoodTruckDetails(id).then(result => {
			this.setState({ truck: result });
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

	handleSubmit = event => {
		this.props.editTruck({
			name: this.state.name,
			menu: this.state.menu,
			schedule: this.state.schedule,
			price: this.state.price,
			status: this.state.status,
			foodtype: this.state.foodtype
		});

		event.preventDefault();
	};

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
									/>
								</FormGroup>
								<FormGroup>
									<Label for="ftStatus">Current Status</Label>
									<Input
										type="select"
										name="status"
										id="ftStatus">
										<option>Open</option>
										<option>Closed</option>
										<option>Closed (Maintenance)</option>
									</Input>
								</FormGroup>
								<FormGroup>
									<Label for="ftFoodType">Food Type</Label>
									<Input
										type="select"
										name="foodtype"
										id="ftFoodType"
										onChange={e =>
											this.setFoodType(e.target.value)
										}>
										<option>Mexican</option>
										<option>Breakfast</option>
										<option>American</option>
									</Input>
								</FormGroup>
								<FormGroup>
									<Label for="ftWebsite">Website</Label>
									<Input
										type="url"
										name="url"
										id="ftWebsite"
										placeholder="(Optional)"
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
					<Button color="danger">Delete Food Truck</Button>
				</div>
			</div>
		);
	}
}
EditFoodTruck = connect(
	() => ({}),
	dispatch => ({
		editTruck: foodTruck => dispatch(Axios.Actions.createFT(foodTruck))
	})
)(EditFoodTruck);