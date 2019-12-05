import React from 'react';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {Col, Container, Row} from 'reactstrap';

export class ViewOtherProfile extends React.Component {
	constructor(props) {
		super(props);
		const URLObject = this.props.match.params;
		let {username: username} = URLObject;
		Axios.viewUser(username).then(result => {
			document.cookie = 'search=' + JSON.stringify(result) + '; path=/';
		});
		this.state = {
			user: JSON.parse(Axios.getCookie('search')),
			username: username
		};
	}

	isOwner() {
		if(this.state.user != null) {
			if (this.state.user.isOwner === true) {
				return 'Owner';
			}
			return 'Customer';
		}
		return 'No User Found';
	}

	render() {
		const URLObject = this.props.match.params;
		let {username: username} = URLObject;

		if(username !== this.state.username) {
			var self = this;
			Axios.viewUser(username).then(result => {
				document.cookie = 'search=' + JSON.stringify(result) + '; path=/';
				// window.parent.location = window.parent.location.href;
				window.location.reload();
			});

		}

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
