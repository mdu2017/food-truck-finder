import React from 'react';
import { connect } from 'react-redux';
import * as NavBars from 'js/navBars';
import User from 'js/images/user_icon.png';
import {
	Button,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Progress,
	Row
} from 'reactstrap';
import * as Axios from 'js/axios';

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
			schedule: [],
			menu: [],
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

	//Runs when page is loaded
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
				).toFixed(2),
				schedule: result.schedFE,
				menu: result.menu
			});
		});

		//Gets ratings for each truck
		Axios.getRatingByTruck(id).then(result => {
			let individualReview = this.state.previousReviews;
			let avg = this.state.averageRating;
			let reviewCount = 0;

			//For each review, display its user and review info
			result.forEach(review => {
				reviewCount++;
				avg += review.rating;

				//Grab user of the review
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

			//Calculate average rating
			if (reviewCount > 0) {
				this.setState({ averageRating: avg / reviewCount });
			}
		});

		//Grab user subscriptions
		if (this.state.user) {
			Axios.getSubscriptions(this.state.user.id).then(result => {
				if (result.indexOf(this.state.truck.id) !== -1) {
					this.setState({ alreadySubscribed: true });
				}
			});
		}
	}

	//Render truck reviews
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

	//Render truck menu
	renderTruckMenu() {
		let render = [];
		render.push(<legend>Menu</legend>);
		{
			this.state.menu.map(item => {
				render.push(
					<div>
						<hr />
						<Row>
							<Col xs="10">
								<h6>
									{item.name} ${item.price}
								</h6>
								<h11>{item.description}</h11>
							</Col>
						</Row>
					</div>
				);
			});
		}
		return render;
	}

	//Render truck schedule
	renderTruckSchedule() {
		let render = [];
		render.push(<legend>Weekly Schedule</legend>);
		{
			this.state.schedule.map(sched => {
				let day = sched.day;
				switch (sched.day) {
					case 'F':
						day = 'Friday';
						break;
					case 'H':
						day = 'Thursday';
						break;
					case 'M':
						day = 'Monday';
						break;
					case 'S':
						day = 'Saturday';
						break;
					case 'T':
						day = 'Tuesday';
						break;
					case 'U':
						day = 'Sunday';
						break;
					case 'W':
						day = 'Wednesday';
						break;
					default:
				}

				render.push(
					<Row>
						<Col xs="3">{day}</Col>
						<Col>
							{sched.startTime} - {sched.endTime}
						</Col>
					</Row>
				);
			});
		}
		return render;
	}

	//Toggle logged in state
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
		if (this.state.review.length > 0) {
			this.props.rateFT({
				userId: JSON.parse(Axios.getCookie('user')).id,
				truckId: this.state.truck.id,
				review: this.state.review,
				rating: this.state.rating
			});
			event.preventDefault();
		} else {
			window.alert('Error: Review cannot be left blank!');
		}
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
								{this.state.user ? (
									<Button
										color="info"
										onClick={this.toggle}
										disabled={this.state.user.isOwner}
									>
										Write Review
									</Button>
								) : (
									<Button color="info" onClick={this.toggle}>
										Write Review
									</Button>
								)}
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
								{this.renderTruckMenu()}
							</Col>
							<Col xs="6">
								{this.renderTruckSchedule()}
								<br />
								<legend>Ratings {'&'} Reviews</legend>
								{this.renderTruckReviews()}
							</Col>
						</Row>
						<br />
						<Row>
							<Col xs="6"></Col>
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
