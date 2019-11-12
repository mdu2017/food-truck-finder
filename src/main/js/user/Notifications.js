import React from 'react';
import * as NavBars from 'js/navBars';
import * as Axios from 'js/axios';
import {Button, ListGroup, ListGroupItem} from 'reactstrap';
import Bell from 'js/images/notificationBell.png';

export class Notifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: JSON.parse(Axios.getCookie('user')),
			notifications: []
		};
	}

	componentDidMount() {
		Axios.getNotifications(this.state.user.id).then(result => {
			console.log(result);
			this.setState({
				notifications: result
			});
		});
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar/>
				<div className="container padded">
					<h1>Notifications</h1>
					{this.state.notifications ? (this.state.notifications.map((note, index) => (
						<ListGroup key={index}>
							<ListGroupItem>
								{note}
								<Button
									color="danger"
									size="sm"
								>
									<img
										src={Bell}
										width={20}
										height={20}
									/>
								</Button>
							</ListGroupItem>
						</ListGroup>
					))) : null}
				</div>
			</div>
		);
	}
}
