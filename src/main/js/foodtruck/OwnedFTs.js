import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import Bell from 'js/images/notificationBell.png';
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
	ListGroup,
	ListGroupItem,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader
} from 'reactstrap';

export class OwnedFoodTrucks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			owner_id: JSON.parse(Axios.getCookie('user')).id,
			trucks: [],
			deals: [],
			notifyModal: false,
			dealModal: false,
			notificationMessage: null,
			dealMessage: null,
			dealStartDate: null,
			dealEndDate: null,
			dealStartTime: null,
			dealEndTime: null,
			foodTruckId: null
		};
		this.toggleNotify = this.toggleNotify.bind(this);
		this.toggleDeal = this.toggleDeal.bind(this);
		this.handleNotifyModalSubmit = this.handleNotifyModalSubmit.bind(this);
		this.handleDealModalSubmit = this.handleDealModalSubmit.bind(this);
	}

	setMessage = notificationMessage => this.setState({ notificationMessage });
	setDealMessage = dealMessage => this.setState({ dealMessage });
	setDealStartTime = dealStartTime => this.setState({ dealStartTime });
	setDealEndTime = dealEndTime => this.setState({ dealEndTime });
	setDealStartDate = dealStartDate => this.setState({ dealStartDate });
	setDealEndDate = dealEndDate => this.setState({ dealEndDate });

	//Runs when page is loaded
	componentDidMount() {

		//Gets all food trucks by their owner
		Axios.getFoodTrucksByOwner(this.state.owner_id).then(result => {
			this.setState({ trucks: result });
			result.map((truck, index) => (
				<li key={index}>{this.setState({ foodTruckId: truck.id })}</li>
			));

			//For each truck in the result, get all deals
			result.forEach(truck => {
				Axios.getAllDeals(truck.id).then(response => {
					let temp = this.state.deals;
					if (response.length !== 0) {
						response.forEach(deal => {
							temp.push(deal);
						});
					}
					this.setState({ deals: temp });
				});
			});
		});
	}

	//Toggle for notifications
	toggleNotify(id) {
		this.setState({
			notifyModal: !this.state.notifyModal,
			foodTruckId: id
		});
	}

	//Toggle for deal
	toggleDeal(id) {
		this.setState({
			dealModal: !this.state.dealModal,
			foodTruckId: id
		});
	}

	//Removes a deal
	deleteDeal(id) {
		Axios.deleteDeal(id).then(result => {
			this.setState({ deals: this.state.deals.filter(deal => {
				if(deal.deal_id !== id) {
					return deal;
				}
			})});
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

	handleDealModalSubmit = () => {
		this.toggleDeal();
		Axios.addDeal(
			this.state.dealMessage,
			this.state.foodTruckId,
			this.state.dealStartDate + 'T' + this.state.dealStartTime,
			this.state.dealEndDate + 'T' + this.state.dealEndTime
		).then(result => console.log(result));
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

	//Renders the deals
	renderDeals() {
		return (
			<div>
				{this.state.deals.length > 0 ? (
					<div>
						{this.state.deals.map((deal, index) => (
							<ListGroup key={index} flush>
								<ListGroupItem>
									<Link
										to={`/food-truck-details/${deal.truck_id}`}
									>
										<Button color="primary" size="sm">
											View Truck
										</Button>
									</Link>{' '}
									<Button
										color="danger"
										size="sm"
										onClick={() =>
											this.deleteDeal(deal.deal_id)
										}
									>
										Remove
									</Button>
									&nbsp;
									<strong>Message: </strong>
									{deal.message}
								</ListGroupItem>
							</ListGroup>
						))}
					</div>
				) : (
					<div>
						<h6>No Current Deals Created.</h6>
						<h6>Create one above!</h6>
					</div>
				)}
			</div>
		);
	}

	//Renders the notifications modal
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

	//Renders the deal modals
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
											this.setDealStartDate(
												e.target.value
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
										onChange={e =>
											this.setDealStartTime(
												e.target.value
											)
										}
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
											this.setDealEndDate(e.target.value)
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
										onChange={e =>
											this.setDealEndTime(e.target.value)
										}
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
					{this.renderDeals()}
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
