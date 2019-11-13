import React from 'react';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import { Col, Row, Container } from 'reactstrap';

export class ViewProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			principal: JSON.parse(Axios.getCookie('user')).principal,
			username: JSON.parse(Axios.getCookie('user')).username,
			owner: JSON.parse(Axios.getCookie('user')).isOwner,
			ownerId: JSON.parse(Axios.getCookie('user')).id,
			reviews: [],
			review: null,
			rating: null
		};
	}

	componentDidMount() {
		Axios.getRatingByUser(this.state.ownerId).then(result => {
			let individualReview = this.state.reviews;
			result.forEach(truck => {
				Axios.getFoodTruckDetails(truck.truck).then(result2 => {
					individualReview.push([
						{
							name: result2.name,
							rating: truck.rating,
							review: truck.message
						}
					]);
					this.setState({ reviews: individualReview });
				});
			});
		});
	}

	isOwner() {
		if (this.state.owner === true) {
			return 'Owner';
		}
		return 'Customer';
	}

	renderTruckReviews() {
		let render = [];
		{
			this.state.reviews.map(truck => {
				truck.forEach(individualReview => {
					render.push(
						<div>
							<h6>Truck: {individualReview.name}</h6>
							<h6>Rating: {individualReview.rating}</h6>
							<h6>Review: {individualReview.review}</h6>
							<br />
						</div>
					);
				});
			});
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
								<h6>Account Type: {this.isOwner()}</h6>
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
