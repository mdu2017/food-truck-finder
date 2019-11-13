import React from 'react';
import { connect } from 'react-redux';
import * as NavBars from 'js/navBars';
import {
	Progress,
	Row,
	Col,
	Button,
	Media,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormGroup,
	Input,
	FormText,
	Label
} from 'reactstrap';
import * as Axios from 'js/axios';
// import SampleMenu from 'js/images/MenuSample.png';

export class ViewFoodTruckDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			truck: null,
			averagePrice: 'N/A',
			userId: JSON.parse(Axios.getCookie('user')).id,
			foodTruckId: null,
			modal: false,
			rating: -1,
			review: ''
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
				averagePrice: ((result.price_high + result.price_low) / 2.0).toFixed(2)
			});
		});
	}

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}

	handleModalSubmit = event => {
		this.toggle();
		this.props.rateFT({
			userId: this.state.userId,
			truckId: this.state.truck.id,
			review: this.state.review,
			rating: this.state.rating
		});
		event.preventDefault();
	};

	subscribe() {
		const URLObject = this.props.match.params;
		let { foodtruckID: id } = URLObject;
		let promise = Axios.subscribe(1, 2);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				{this.state.truck ? (
					<div className="container padded">
						<h1>{this.state.truck.name}</h1>
						<br />
						<Row>
							<Col xs="auto">
								<Button color="primary" onClick={this.subscribe()}>
									Subscribe
				</Button>
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
									<span style={{ color: 'blue' }}>{this.state.truck.type}</span>
								</legend>
							</Col>
							<Col xs="auto">
								<Button color="info" onClick={this.toggle}>
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
										<span>{this.state.truck.description}</span>
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
								<div className="text-left">5 of 5</div>
								<Progress value="5" max="5" style={{ width: 100 }} />
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
						<Row>
							<Col xs="auto">
								<legend>Route</legend>
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
										onChange={e => this.setRating(e.target.value)}
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
										onChange={e => this.setReview(e.target.value)}
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
				.then(function () {
					// window.location.href = '/#/list-food-trucks';
					window.alert('Rating & Review Submission was successful!');
				})
				// Failed
				.catch(() => window.alert('Rating & Review Submission failed!'))
	})
)(ViewFoodTruckDetails);
