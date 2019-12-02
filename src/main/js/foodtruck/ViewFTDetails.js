import React from 'react';
import { connect } from 'react-redux';
import * as NavBars from 'js/navBars';
import User from 'js/images/user_icon.png';
import {
	Progress,
	Row,
	Col,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormGroup,
	Input,
	Label
} from 'reactstrap';
import * as Axios from 'js/axios';
// import SampleMenu from 'js/images/MenuSample.png';

export class ViewFoodTruckDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			truck: null,
			user: JSON.parse(Axios.getCookie('user')),
			averagePrice: 'N/A',
			foodTruckId: null,
			modal: false,
			rating: 1,
			review: '',
			notLoggedIn: false,
			previousReviews: [],
			averageRating: 0,
			alreadySubscribed: false
		};
		this.toggle = this.toggle.bind(this);
		this.handleModalSubmit = this.handleModalSubmit.bind(this);
	}

	setRating = rating => this.setState({ rating });
	setReview = review => this.setState({ review });

	componentDidMount() {
		const URLObject = this.props.match.params;
		// Object Destruction
		var { foodtruckID: id } = URLObject;
		Axios.getFoodTruckDetails(id).then(result => {
			this.setState({
				truck: result,
				averagePrice: (
					(result.price_high + result.price_low) /
					2.0
				).toFixed(2)
			});
		});
		Axios.getRatingByTruck(id).then(result => {
			let individualReview = this.state.previousReviews;
			let avg = this.state.averageRating;
			let reviewCount = 0;
			result.forEach(review => {
				reviewCount++;
				avg += review.rating;
				Axios.viewUserByID(review.user).then(user => {
					individualReview.push([
						{
							message: review.message,
							date_year: review.date[0],
							date_month: review.date[1],
							date_day: review.date[2],
							rating: review.rating,
							user: user.username
						}
					]);
					this.setState({ previousReviews: individualReview });
				});
			});
			if (reviewCount > 0) {
				this.setState({ averageRating: avg / reviewCount });
			}
		});
		if (this.state.user) {
			Axios.getSubscriptions(this.state.user.id).then(result => {
				if (result.indexOf(this.state.truck.id) !== -1) {
					this.setState({ alreadySubscribed: true });
				}
			});
		}
	}

	renderTruckReviews() {
		let render = [];
		{
			this.state.previousReviews.map(truck => {
				truck.forEach(individualReview => {
					render.push(
						<div>
							<h6
								style={{
									fontWeight: 'bold',
									fontSize: 'small'
								}}
							>
								{individualReview.date_month}
								{'/'}
								{individualReview.date_day}
								{'/'}
								{individualReview.date_year}
							</h6>
							<h6>
								<img
									src={User}
									width={20}
									height={20}
									mode="center"
								/>
								{individualReview.user}{' '}
								{individualReview.rating} {'/ 5'}
							</h6>
							<h6>{individualReview.message}</h6>
							<br />
						</div>
					);
				});
			});
		}
		return render;
	}

	toggle() {
		if (JSON.parse(Axios.getCookie('user') === null)) {
			this.setState({ notLoggedIn: true });
		} else {
			this.setState({
				modal: !this.state.modal
			});
		}
	}

	handleModalSubmit = event => {
		this.toggle();
		this.props.rateFT({
			userId: JSON.parse(Axios.getCookie('user')).id,
			truckId: this.state.truck.id,
			review: this.state.review,
			rating: this.state.rating
		});
		event.preventDefault();
	};

	subscribe() {
		try {
			const URLObject = this.props.match.params;
			let { foodtruckID: id } = URLObject;
			Axios.subscribe(id, JSON.parse(Axios.getCookie('user')).id).then(
				function() {
					window.alert('You are successfully subscribed!');
					window.location.reload();
				}
			);
		} catch (error) {
			this.setState({ notLoggedIn: true });
		}
	}

	unsubscribe() {
		try {
			const URLObject = this.props.match.params;
			let { foodtruckID: id } = URLObject;
			Axios.unsubscribe(JSON.parse(Axios.getCookie('user')).id, id).then(
				function() {
					window.alert('You are successfully unsubscribed!');
					window.location.reload();
				}
			);
		} catch (error) {
			this.setState({ notLoggedIn: true });
		}
	}

	render() {
		if (this.state.notLoggedIn) {
			window.alert('Please login to Rate/Review a Truck');
		}
		return (
			<div>
				<NavBars.CustomNavBar />
				{this.state.truck ? (
					<div className="container padded">
						<h1>{this.state.truck.name}</h1>
						<br />
						<Row>
							<Col xs="auto">
								{this.state.alreadySubscribed ? (
									<Button
										color="danger"
										onClick={() => this.unsubscribe()}
									>
										Unsubscribe
									</Button>
								) : (
									<Button
										color="primary"
										onClick={() => this.subscribe()}
									>
										Subscribe
									</Button>
								)}
							</Col>
							<Col xs="auto">
								<legend>
									Status:{' '}
									{this.state.truck.status == 'OPEN' ? (
										<span style={{ color: 'green' }}>
											{this.state.truck.status}
										</span>
									) : (
										<span style={{ color: 'red' }}>
											{this.state.truck.status}
										</span>
									)}
								</legend>
							</Col>
							<Col xs="auto">
								<legend>
									Type:{' '}
									<span style={{ color: 'blue' }}>
										{this.state.truck.type}
									</span>
								</legend>
							</Col>
							<Col xs="auto">
								<Button color="info" onClick={this.toggle} disabled={this.state.user.isOwner}>
									Write Review
								</Button>
							</Col>
						</Row>
						<br />
						<Row>
							<Col xs="6">
								<legend>Description</legend>
								{this.state.truck.description ? (
									<div>
										<span>
											{this.state.truck.description}
										</span>
									</div>
								) : (
									<div>
										<span>No Description Available</span>
									</div>
								)}
							</Col>
							<Col xs="3">
								<legend>Average Price</legend>
								{'$'}
								{this.state.averagePrice}
							</Col>
							<Col xs="3">
								<legend>Rating</legend>
								<div className="text-left">
									{this.state.averageRating !== 0 ? (
										<div>
											{this.state.averageRating.toFixed(
												1
											)}
											{' of 5'}
										</div>
									) : (
										<div>{'No Ratings Available'}</div>
									)}
								</div>
								<Progress
									value={this.state.averageRating}
									max="5"
									style={{ width: 100 }}
								/>
							</Col>
						</Row>
						<br />
						<Row>
							<Col>
								<legend>Menu</legend>
								{/* <Media left href={SampleMenu}>
									<Media
										object
										src={SampleMenu}
										width={300}
										height={300}
									/>
								</Media> */}
								{'Coming Soon'}
							</Col>
							<Col xs="6">
								<legend>Weekly Schedule</legend>
								<Row>
									<Col xs="3">Sunday</Col>
									<Col>7pm - 8 pm</Col>
								</Row>
								<Row>
									<Col xs="3">Monday</Col>
									<Col>7pm - 8 pm</Col>
								</Row>
								<Row>
									<Col xs="3">Tuesday</Col>
									<Col>7pm - 8 pm</Col>
								</Row>
								<Row>
									<Col xs="3">Wednesday</Col>
									<Col>7pm - 8 pm</Col>
								</Row>
								<Row>
									<Col xs="3">Thursday</Col>
									<Col>7pm - 8 pm</Col>
								</Row>
								<Row>
									<Col xs="3">Friday</Col>
									<Col>7pm - 8 pm</Col>
								</Row>
								<Row>
									<Col xs="3">Saturday</Col>
									<Col>7pm - 8 pm</Col>
								</Row>
							</Col>
						</Row>
						<br />
						<Row>
							<Col xs="6">
								<legend>Route</legend>
							</Col>
							<Col xs="6">
								<legend>Ratings {'&'} Reviews</legend>
								{this.renderTruckReviews()}
							</Col>
						</Row>
					</div>
				) : null}
				<div className="modal">
					<Modal
						isOpen={this.state.modal}
						size="lg"
						scrollable="true"
						style={{ height: '400px', width: '425px' }}
					>
						<Form onSubmit={this.handleModalSubmit}>
							<ModalHeader>Write Review</ModalHeader>
							<ModalBody>
								<FormGroup>
									<Label for="rating">Rating</Label>
									<Input
										type="select"
										name="rating"
										id="rating"
										onChange={e =>
											this.setRating(e.target.value)
										}
									>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Input>
								</FormGroup>
								<FormGroup>
									<Label for="review">Review</Label>
									<Input
										type="textarea"
										name="review"
										id="review"
										placeholder="Limited to 500 or less characters"
										onChange={e =>
											this.setReview(e.target.value)
										}
									/>
								</FormGroup>
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
						</Form>
					</Modal>
				</div>
			</div>
		);
	}
}
ViewFoodTruckDetails = connect(
	() => ({}),
	dispatch => ({
		rateFT: ratingReview =>
			dispatch(
				Axios.Actions.rateFT(
					ratingReview.userId,
					ratingReview.truckId,
					ratingReview.review,
					ratingReview.rating
				)
			)
				// Success
				.then(function() {
					window.alert('Rating & Review Submission was successful!');
					window.location.reload();
				})
				// Failed
				.catch(() => window.alert('Rating & Review Submission failed!'))
	})
)(ViewFoodTruckDetails);
