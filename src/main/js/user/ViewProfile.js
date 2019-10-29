import React from 'react';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import { Col, Row, Container } from 'reactstrap';
import _ from 'lodash';

export class ViewProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: Axios.getCookie('search')
		};
	}

	setUser = user => this.setState({ user });

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
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>View Profile</h1>
					<h2>{_.isDefined(this.state.user) && this.state.user.username}</h2>
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

	componentDidMount() {
		const URLObject = this.props.match.params;
		let {username: username} = URLObject;
		let promise = Axios.viewUser(username).then(result => {
			document.cookie = 'search=' + JSON.stringify(result) + '; path=/';
		});
		this.setUser(JSON.parse(Axios.getCookie('search')));
		console.log(this.state.user);
	}
}
