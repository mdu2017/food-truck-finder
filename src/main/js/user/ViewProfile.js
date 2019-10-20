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
			owner: JSON.parse(Axios.getCookie('user')).isOwner
		};
	}

	isOwner() {
		if (this.state.owner === true) {
			return 'Owner';
		}
		return 'Customer';
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
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		);
	}
}