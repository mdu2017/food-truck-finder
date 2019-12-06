import React from 'react';
import {Link} from 'react-router-dom';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {Button, Col, Container, Row} from 'reactstrap';

export class ViewProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			principal: JSON.parse(Axios.getCookie('user')).principal,
			username: JSON.parse(Axios.getCookie('user')).username,
			owner: JSON.parse(Axios.getCookie('user')).isOwner,
			userId: JSON.parse(Axios.getCookie('user')).id,
			reviews: [],
			review: null,
			rating: null,
			subscriptions: []
		};
	}

	//Grab ratings by user when page loads
	componentDidMount() {
		Axios.getRatingByUser(this.state.userId).then(result => {
			let individualReview = this.state.reviews;
			result.forEach(truck => {
				Axios.getFoodTruckDetails(truck.truck).then(result2 => {
					individualReview.push([
						{
							id: result2.id,
							name: result2.name,
							rating: truck.rating,
							review: truck.message
						}
					]);
					this.setState({ reviews: individualReview });
				});
			});
		});

		//Get subscriptions for user
		Axios.getSubscriptions(this.state.userId).then(result => {
			let sub = this.state.subscriptions;
			result.forEach(truck_id => {
				Axios.getFoodTruckDetails(truck_id).then(result2 => {
					sub.push([
						{
							id: result2.id,
							name: result2.name
						}
					]);
					this.setState({ subscriptions: sub });
				});
			});
		});
	}

	//Removes review
	removeReview(foodtruckId) {
		Axios.removeReview(foodtruckId, this.state.userId).then(result => {
			window.alert('Rating & Review Submission was successful removed!');
			window.location.reload();
		});
	}

	renderTruckReviews() {
		let render = [];
		{
			this.state.reviews.map(truck => {
				truck.forEach(individualReview => {
					render.push(
						<div>
							<h6>
								<Link
									to={`/food-truck-details/${individualReview.id}`}
								>
									<Button color="link" size="md">
										{individualReview.name}
									</Button>
								</Link>{' '}
								<span
									style={{
										fontWeight: 'bold',
										fontSize: 'small'
									}}
								>
									{individualReview.rating} / 5
								</span>{' '}
								<Button
									color="danger"
									size="sm"
									onClick={() =>
										this.removeReview(individualReview.id)
									}
								>
									Remove
								</Button>
							</h6>
							<h6>Review: {individualReview.review}</h6>
							<br />
						</div>
					);
				});
			});
			if (this.state.reviews.length === 0) {
				render.push(
					<div>
						<h6>No Ratings Available</h6>
					</div>
				);
			}
		}
		return render;
	}

	//Renders the subscription list
	renderSubscriptionList() {
		let render = [];
		{
			this.state.subscriptions.map(truck => {
				truck.forEach(sub => {
					render.push(
						<div>
							<Link to={`/food-truck-details/${sub.id}`}>
								<Button color="link" size="md">
									{sub.name}
								</Button>
							</Link>{' '}
							<br />
						</div>
					);
				});
			});
			if (this.state.subscriptions.length === 0) {
				render.push(
					<div>
						<h6>No Subscriptions Available</h6>
					</div>
				);
			}
		}
		return render;
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>View Profile</h1>
					<Container>
						<Row>
							<Col>
								<h2>Account Details</h2>
								<h6>Username: {this.state.username}</h6>
								<h6>Email: {this.state.principal}</h6>
								<h6>
									Account Type:{' '}
									{this.state.owner ? 'Owner' : 'Customer'}
								</h6>
								<br />
								<h2>Subscriptions</h2>
								{this.renderSubscriptionList()}
							</Col>
							<Col>
								<h2>Ratings {'&'} Reviews</h2>
								{this.renderTruckReviews()}
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		);
	}
}
