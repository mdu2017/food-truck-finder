import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'js/backend';
import * as NavBars from 'js/navBar';
import * as createFoodTruck from 'js/createFoodTruck';

import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
	ListGroup,
	ListGroupItem,
	Container,
	Col,
	Row
} from 'reactstrap';

export class CreateFoodTruckPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: null,
			// menu: null,
			// schedule: null,
			price_low: null,
			price_high: null,
			status: null
		};
	}


	// setMenu = menu => this.setState({ menu });
	// setSchedule = schedule => this.setState({ schedule });
	setName = name => this.setState({ name });
	setPrice_low = price_low => this.setState({ price_low });
	setPrice_high = price_high => this.setState({ price_high });
	setStatus = status => this.setState({ status });

	handleSubmit = event => {
		event.preventDefault();

		this.props.createFT({
			name: this.state.name,
			// menu: this.state.menu,
			// schedule: this.state.schedule,
			price_low: this.state.price_low,
			price_high: this.state.price_high,
			status: this.state.status
		});

	};

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
							<Label for="ftStatus">Current Status</Label>
							<Input type="select" name="status" id="ftStatus" onChange={e => this.setStatus(e.target.value)}>

								<option >Open</option>
								<option>Closed</option>
								<option>Closed (Maintenance)</option>

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
									onChange={e => this.setPrice_low(e.target.value)}
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
									onChange={e => this.setPrice_high(e.target.value)}
								/>
							</FormGroup>
						</Form>
						<FormGroup>
							<Label for="ftDescription">Description</Label>
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
							<Input type="file" name="menu" id="ftMenu" />
							<FormText color="muted">
								This is some placeholder block-level help text
								for the above input. It's a bit lighter and
								easily wraps to a new line.
							</FormText>
						</FormGroup>
						<FormGroup tag="fieldset">
							<legend>Schedule</legend>
							{this.displayDayOfTheWeek('Sunday')}
							{this.displayDayOfTheWeek('Monday')}
							{this.displayDayOfTheWeek('Tuesday')}
							{this.displayDayOfTheWeek('Wednesday')}
							{this.displayDayOfTheWeek('Thursday')}
							{this.displayDayOfTheWeek('Friday')}
							{this.displayDayOfTheWeek('Saturday')}
						</FormGroup>
						<Button onClick={this.handleSubmit}>Submit</Button>
					</Form>
				</div>
			</div>
		);
	}
}
CreateFoodTruckPage = connect(
	() => ({}),
	dispatch => ({
		createFT: foodTruck => dispatch(createFoodTruck.Actions.createFT(foodTruck))
	})
)(CreateFoodTruckPage);

export class ListFoodTrucks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authentication: Users.getCookie('authentication'),
			user: Users.getCookie('user'),
			logout: Users.Actions.logout(),
			owner_id: Users.getCookie('userid'),
			isOwner: Users.getCookie('owner'),
			trucks: []
		};
	}

	componentWillMount() {
		Users.getFoodTrucksByOwner(this.state.owner_id).then(result => {
			this.setState({ trucks: result });
		});
	}

	renderFoodTrucks() {
		return (
			<div>
				{this.state.trucks ? (
					<ListGroup>
						{this.state.trucks.map((truck, index) => (
							<ListGroupItem
								tag="a"
								href="#/edit-food-truck"
								key={index}>
								{truck.name}
							</ListGroupItem>
						))}
					</ListGroup>
				) : null}
			</div>
		);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Your Food Trucks</h1>
					{this.renderFoodTrucks()}
				</div>
			</div>
		);
	}
}

export class EditFoodTruck extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: null,
			menu: null,
			schedule: null,
			price: null,
			status: null
		};
	}

	setName = name => this.setState({ name });
	setMenu = menu => this.setState({ menu });
	setSchedule = schedule => this.setState({ schedule });
	setPrice = price => this.setState({ price });
	setStatus = status => this.setState({ status });

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
		this.props.register({
			name: this.state.name,
			menu: this.state.menu,
			schedule: this.state.schedule,
			price: this.state.price,
			status: this.state.status
		}); // Add registration
		event.preventDefault();
	};

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Edit a Food Truck</h1>
					<br />
					<Form>
						<FormGroup>
							<Label for="ftName">Name</Label>
							<Input
								type="text"
								name="name"
								id="ftName"
								placeholder="Name of Food Truck"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="ftStatus">Current Status</Label>
							<Input type="select" name="status" id="ftStatus">
								<option>Open</option>
								<option>Closed</option>
								<option>Closed (Maintenance)</option>
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
								placeholder="(Optional) Will be displayed on the Food Truck's page"
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
					<legend>Schedule / Route</legend>
					{this.displayDayOfTheWeek('Sunday')}
					{this.displayDayOfTheWeek('Monday')}
					{this.displayDayOfTheWeek('Tuesday')}
					{this.displayDayOfTheWeek('Wednesday')}
					{this.displayDayOfTheWeek('Thursday')}
					{this.displayDayOfTheWeek('Friday')}
					{this.displayDayOfTheWeek('Saturday')}
					<Button>Submit</Button>{' '}
					<Button color="danger">Delete Food Truck</Button>
				</div>
			</div>
		);
	}
}

export class EditRouteSchedulePage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the edit food truck route and schedule page.
				<ul>
					<li>
						<Link to="/edit-food-truck">Edit Food Truck</Link>
					</li>
				</ul>
			</div>
		);
	}
}

export class CreateEventPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the create event page.
			</div>
		);
	}
}

export class CreateSpecialPage extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the create special page.
			</div>
		);
	}
}
