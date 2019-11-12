import React from 'react';
import * as NavBars from 'js/navBars';
import { Progress, Row, Col, Button, Media } from 'reactstrap';
import * as Axios from 'js/axios';
// import SampleMenu from 'js/images/MenuSample.png';

export class ViewFoodTruckDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			truck: null,
			averagePrice: 'N/A',
			ownerId: JSON.parse(Axios.getCookie('user')).id,
			notificationMessage: null,
			foodTruckId: null
		};
	}

	componentDidMount() {
		const URLObject = this.props.match.params;
		// Object Destruction
		var { foodtruckID: id } = URLObject;
		Axios.getFoodTruckDetails(id).then(result => {
			console.log(result);
			this.setState({
				truck: result,
				averagePrice: (
					(result.price_high + result.price_low) /
					2.0
				).toFixed(2)
			});
		});
	}

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
								<Button
									color="primary"
									onClick={this.subscribe()}>
									Subscribe
								</Button>
							</Col>
							<Col xs="auto">
								<legend>
									Status:{' '}
									<span style={{ color: 'green' }}>
										{this.state.truck.status}
									</span>
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
			</div>
		);
	}
}
