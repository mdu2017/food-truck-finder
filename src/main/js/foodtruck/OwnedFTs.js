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
	Input
} from 'reactstrap';

export class OwnedFoodTrucks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			owner_id: JSON.parse(Axios.getCookie('user')).id,
			trucks: [],
			modal: false,
			notificationMessage: null,
			foodTruckId: null
		};
		this.toggle = this.toggle.bind(this);
		this.handleModalSubmit = this.handleModalSubmit.bind(this);
	}

	setMessage = notificationMessage => this.setState({ notificationMessage });

	componentWillMount() {
		Axios.getFoodTrucksByOwner(this.state.owner_id).then(result => {
			this.setState({ trucks: result });
			result.map((truck, index) => (
				<li key={index}>{this.setState({ foodTruckId: truck.id })}</li>
			));
		});
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleModalSubmit = event => {
		this.toggle();
		// console.log(this.state.foodTruckId);
		this.props.notifyUsers({
			message: this.state.notificationMessage,
			foodTruckId: this.state.foodTruckId
		});
		event.preventDefault();
	};

	renderFoodTrucks() {
		return (
			<div>
				{this.state.trucks.length > 0 ? (
					<div>
						{this.state.trucks.map((truck, index) => (
							<ListGroup key={index}>
								<ListGroupItem>
									{truck.name}{' '}
									<Link to={`/edit-food-truck/${truck.id}`}>
										<Button color="primary" size="sm">
											Edit
										</Button>
									</Link>{' '}
									<Button
										color="info"
										size="sm"
										onClick={this.toggle}>
										<img
											src={Bell}
											width={20}
											height={20}
											mode="fit"
										/>
									</Button>
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

	renderModal() {
		return (
			<div>
				<Modal isOpen={this.state.modal}>
					<form onSubmit={this.handleModalSubmit}>
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
							<Button color="danger" onClick={this.toggle}>
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
				</div>
				{this.renderModal()}
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
				.catch(error => window.alert('Failed to send notification!'))
	})
)(OwnedFoodTrucks);
