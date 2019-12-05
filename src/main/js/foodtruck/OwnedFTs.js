import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import Bell from 'js/images/notificationBell.png';
import {
	ListGroup,
	ListGroupItem,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Form,
	FormGroup,
	Label
} from 'reactstrap';

export class OwnedFoodTrucks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			owner_id: JSON.parse(Axios.getCookie('user')).id,
			trucks: [],
			notifyModal: false,
			dealModal: false,
			notificationMessage: null,
			dealMessage: null,
			foodTruckId: null
		};
		this.toggleNotify = this.toggleNotify.bind(this);
		this.toggleDeal = this.toggleDeal.bind(this);
		this.handleNotifyModalSubmit = this.handleNotifyModalSubmit.bind(this);
		this.handleDealModalSubmit = this.handleDealModalSubmit.bind(this);
	}

	setMessage = notificationMessage => this.setState({ notificationMessage });
	setDealMessage = dealMessage => this.setState({ dealMessage });

	componentDidMount() {
		Axios.getFoodTrucksByOwner(this.state.owner_id).then(result => {
			this.setState({ trucks: result });
			result.map((truck, index) => (
				<li key={index}>{this.setState({ foodTruckId: truck.id })}</li>
			));
		});
	}

	toggleNotify(id) {
		this.setState({
			notifyModal: !this.state.notifyModal,
			foodTruckId: id
		});
	}

	toggleDeal(id) {
		this.setState({
			dealModal: !this.state.dealModal,
			foodTruckId: id
		});
	}

	handleNotifyModalSubmit = event => {
		this.toggleNotify();
		this.props.notifyUsers({
			message: this.state.notificationMessage,
			foodTruckId: this.state.foodTruckId
		});
		event.preventDefault();
	};

	handleDealModalSubmit = event => {
		this.toggleDeal();
		event.preventDefault();
	};

	renderFoodTrucks() {
		return (
			<div>
				{this.state.trucks.length > 0 ? (
					<div>
						{this.state.trucks.map((truck, index) => (
							<ListGroup key={index} flush>
								<ListGroupItem>
									<Link
										to={`/food-truck-details/${truck.id}`}
									>
										<Button color="primary" size="sm">
											View
										</Button>
									</Link>{' '}
									<Link to={`/edit-food-truck/${truck.id}`}>
										<Button color="secondary" size="sm">
											Edit
										</Button>
									</Link>{' '}
									<Button
										color="info"
										size="sm"
										onClick={() =>
											this.toggleNotify(truck.id)
										}
									>
										<img
											src={Bell}
											width={20}
											height={20}
											mode="fit"
										/>
									</Button>{' '}
									<Button
										color="success"
										size="sm"
										onClick={() =>
											this.toggleDeal(truck.id)
										}
									>
										$$$
									</Button>
									&nbsp;
									{truck.name}
								</ListGroupItem>
							</ListGroup>
						))}
					</div>
				) : (
					<div>
						<h6>No Food Trucks Created.</h6>
						<Link to={'/create-food-truck'}>
							<h6>Create One!</h6>
						</Link>
					</div>
				)}
			</div>
		);
	}

	renderNotifyModal() {
		return (
			<div>
				<Modal isOpen={this.state.notifyModal}>
					<form onSubmit={this.handleNotifyModalSubmit}>
						<ModalHeader>Notify Subscribers</ModalHeader>
						<ModalBody>
							<Input
								type="textarea"
								name="text"
								id="exampleText"
								placeholder="Limited to 300 characters."
								onChange={e => this.setMessage(e.target.value)}
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
								onClick={() => this.toggleNotify(null)}
							>
								Cancel
							</Button>
						</ModalFooter>
					</form>
				</Modal>
			</div>
		);
	}

	renderDealModal() {
		return (
			<div>
				<Modal isOpen={this.state.dealModal}>
					<form onSubmit={this.handleDealModalSubmit}>
						<ModalHeader>New Deal</ModalHeader>
						<ModalBody>
							<Label for="message">Message</Label>
							<Input
								type="textarea"
								name="text"
								id="message"
								placeholder="Limited to 300 characters."
								onChange={e =>
									this.setDealMessage(e.target.value)
								}
							/>
							<br />
							<Label for="startDate">Start Date {'&'} Time</Label>
							<Form inline>
								<FormGroup>
									<Input
										type="date"
										name="date"
										id="startDate"
										placeholder="date placeholder"
										onChange={e =>
											console.log(
												JSON.stringify(e.target.value)
											)
										}
									/>
								</FormGroup>
								&nbsp;
								<FormGroup>
									<Input
										type="time"
										name="time"
										id="startTime"
										placeholder="time placeholder"
									/>
								</FormGroup>
							</Form>
							&nbsp;
							<Label for="endDate">End Date {'&'} Time</Label>
							<Form inline>
								<FormGroup>
									<Input
										type="date"
										name="date"
										id="endDate"
										placeholder="date placeholder"
										onChange={e =>
											console.log(
												JSON.stringify(e.target.value)
											)
										}
									/>
								</FormGroup>
								&nbsp;
								<FormGroup>
									<Input
										type="time"
										name="time"
										id="endTime"
										placeholder="time placeholder"
									/>
								</FormGroup>
							</Form>
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
								onClick={() => this.toggleDeal(null)}
							>
								Cancel
							</Button>
						</ModalFooter>
					</form>
				</Modal>
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
					<br />
					<h1>Current Deals</h1>
				</div>
				{this.renderNotifyModal()}
				{this.renderDealModal()}
			</div>
		);
	}
}
OwnedFoodTrucks = connect(
	() => ({}),
	dispatch => ({
		notifyUsers: notification =>
			dispatch(
				Axios.Actions.sendNotification(
					notification.message,
					notification.foodTruckId
				)
			)
				// Success
				.then(function(result) {
					window.alert('Notification was sent successfully!');
				})
				// Failed
				.catch(error => window.alert('Failed to send notification!')),
		addDeal: deal =>
			dispatch(
				Axios.Actions.addDeal(
					deal.message,
					deal.foodTruckId,
					deal.startTime,
					deal.endTime
				)
			)
				.then(function(result) {
					window.alert('Deal was created successfully!');
				})
				.catch(error => window.alert('Failed to create deal!'))
	})
)(OwnedFoodTrucks);
