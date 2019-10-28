import React from 'react';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import { Col, Row, Container } from 'reactstrap';

export class ViewProfile extends React.Component {
	constructor(props) {
		super(props);
		const URLObject = this.props.match.params;
		let {username: username} = URLObject;
		this.state = {
			user: Axios.viewUser(username)
		};
		console.log(this.state.user);
		console.log(document.cookie);
	}

	isOwner() {
		if (this.state.user.isOwner === true) {
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
					<h2>{this.state.user.username}</h2>
					<Container>
						<Row>
							<Col>
								<h2>Account Details</h2>
								<h6>Username: {this.state.user.username}</h6>
								<h6>Email: {this.state.user.principal}</h6>
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
