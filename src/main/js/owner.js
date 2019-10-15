import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Users from 'js/backend';
import * as Login from 'js/forms';
import axios from 'axios';
import * as NavBars from 'js/navBar';
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
	ListGroup,
	ListGroupItem
} from 'reactstrap';

export class CreateFoodTruckPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: null,
			route: null,
			menu: null,
			schedule: null,
			price: null,
			status: null
		};
	}

	setName = name => this.setState({ name });
	setRoute = route => this.setState({ route });
	setMenu = menu => this.setState({ menu });
	setSchedule = schedule => this.setState({ schedule });
	setPrice = price => this.setState({ price });
	setStatus = status => this.setState({ status });

	handleSubmit = event => {
		this.props.register({
			name: this.state.name,
			route: this.state.route,
			menu: this.state.menu,
			schedule: this.state.schedule,
			price: this.state.price,
			status: this.state.status
		}); // Add registration
		event.preventDefault();
	};

	displayDayOfTheWeek(dayofTheWeek) {
		return (
			<div>
				<Form inline>
					<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
						<Input type="checkbox" />
						{dayofTheWeek}
					</FormGroup>
					<FormGroup>
						<Input type="time" name="time" id="StartTime" />
						<Label for="EndTime"> - </Label>
						<Input type="time" name="time" id="EndTime" />
					</FormGroup>
				</Form>
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
							/>
						</FormGroup>
						<FormGroup>
							<Label for="ftRoute">Route</Label>
							<Input
								type="text"
								name="route"
								id="ftRoute"
								placeholder="route placeholder"
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
						<Form inline>
							<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
								<Label for="ftPrice" className="mr-sm-2">
									Average Price
								</Label>
								<Input
									type="number"
									min={0}
									name="price"
									id="ftPrice"
									placeholder="Whole Numbers Only"
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
						<Button>Submit</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export class ListFoodTrucks extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Your Food Trucks</h1>
					<ListGroup>
						<ListGroupItem tag="a" href="#/edit-food-truck">
							Food Truck 1
						</ListGroupItem>
						<ListGroupItem tag="a" href="#/edit-food-truck">
							Food Truck 2
						</ListGroupItem>
						<ListGroupItem tag="a" href="#/edit-food-truck">
							Food Truck 3
						</ListGroupItem>
						<ListGroupItem tag="a" href="#/edit-food-truck">
							Food Truck 4
						</ListGroupItem>
						<ListGroupItem tag="a" href="#/edit-food-truck">
							Food Truck 5
						</ListGroupItem>
					</ListGroup>
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
			route: null,
			menu: null,
			schedule: null,
			price: null,
			status: null
		};
	}

	setName = name => this.setState({ name });
	setRoute = route => this.setState({ route });
	setMenu = menu => this.setState({ menu });
	setSchedule = schedule => this.setState({ schedule });
	setPrice = price => this.setState({ price });
	setStatus = status => this.setState({ status });

	displayDayOfTheWeek(dayofTheWeek) {
		return (
			<div>
				<Form inline>
					<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
						<Input type="checkbox" />
						{dayofTheWeek}
					</FormGroup>
					<FormGroup>
						<Input type="time" name="time" id="StartTime" />
						<Label for="EndTime"> - </Label>
						<Input type="time" name="time" id="EndTime" />
					</FormGroup>
				</Form>
			</div>
		);
	}

	handleSubmit = event => {
		this.props.register({
			name: this.state.name,
			route: this.state.route,
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
							<Label for="ftRoute">Route</Label>
							<Input
								type="text"
								name="route"
								id="ftRoute"
								placeholder="route placeholder"
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
						<Form inline>
							<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
								<Label for="ftPrice" className="mr-sm-2">
									Average Price
								</Label>
								<Input
									type="number"
									min={0}
									name="price"
									id="ftPrice"
									placeholder="Whole Numbers Only"
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
						<Button>Submit</Button>{' '}
						<Button color="danger">Delete Food Truck</Button>
					</Form>
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
