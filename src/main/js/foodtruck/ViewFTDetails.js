import React from 'react';
import * as NavBars from 'js/navBars';
import { Progress, Row, Col, Button, Media } from 'reactstrap';
import SampleMenu from 'js/images/MenuSample.png';
import * as Axios from 'js/axios';

export class ViewFoodTruckDetails extends React.Component {
	subscribe() {
		const URLObject = this.props.match.params;
		let {foodtruckID: id} = URLObject;
		let promise = Axios.subscribe(1, 2);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Torchy's Details Page</h1>
					<br />
					<Row>
						<Col xs="auto">
							<Button color="primary" onClick={this.subscribe()}>Subscribe</Button>
						</Col>
						<Col xs="auto">
							<legend>
								Status:{' '}
								<text style={{ color: 'green' }}>Open</text>
							</legend>
						</Col>
					</Row>
					<br />
					<Row>
						<Col xs="6">
							<legend>Description</legend>
							This is a short, temporary description to describe a
							food truck. It is optional input by the owner. It
							can be updated at any time.
						</Col>
						<Col xs="3">
							<legend>Average Price</legend>
							$3.25
						</Col>
						<Col xs="3">
							<legend>Rating</legend>
							<div className="text-left">5 of 5</div>
							<Progress
								value="5"
								max="5"
								style={{ width: 100 }}
							/>
						</Col>
					</Row>
					<br />
					<Row>
						<Col>
							<legend>Menu</legend>
							<Media left href={SampleMenu}>
								<Media
									object
									src={SampleMenu}
									width={300}
									height={300}
								/>
							</Media>
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
						<legend>Route</legend>
					</Row>
				</div>
			</div>
		);
	}
}
