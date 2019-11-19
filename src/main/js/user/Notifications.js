import React from 'react';
import * as NavBars from 'js/navBars';
import * as Axios from 'js/axios';
import {
	Button,
	ListGroup,
	ListGroupItem,
	Row,
	Col,
	Container
} from 'reactstrap';
import {update} from 'js/axios';

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

	markAsRead(userId, truckId, sent, index) {
		Axios.changeNotificationStatus(userId, truckId, sent).then(result => {
			this.setState({
				notifications: update(this.state.notifications, {index: {viewed: true}})
			});
		});
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Notifications</h1>
					<br />

					{this.state.notifications.length > 0 ? (
						this.state.notifications.map((note, index) => (
							<ListGroup key={index}>
								<ListGroupItem>
									<Container>
										<Row>{note.from + ': ' + note.message}</Row>
										<Row>{note.sent[1] + '/' + note.sent[2] + '/' + note.sent[0]}</Row>
										<br />
										<Row>
											<Col sm={{ size: 'auto' }}>
												<Button
													color="primary"
													size="sm"
													onClick={() => this.markAsRead(this.state.user.id, note.truckId, note.sent, index)}
												>
													Mark as Read
												</Button>
											</Col>
											<Col sm={{ size: 'auto' }}>
												<Button
													color="danger"
													size="sm"
												>
													Dismiss
												</Button>
											</Col>
										</Row>
									</Container>
								</ListGroupItem>
							</ListGroup>
						))
					) : (
						<h6>All Notifications have been read. =)</h6>
					)}
				</div>
			</div>
		);
	}
}
