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
			result.sort(function(a, b) {
				if(a.sent[0] === b.sent[0]) {
					if(a.sent[1] === b.sent[1]) {
						if(a.sent[2] === b.sent[2]) {
							if(a.sent[3] === b.sent[3]) {
								if(a.sent[4] === b.sent[4]) {
									return a.sent[5] - b.sent[5];
								} else {
									return a.sent[4] - b.sent[4];
								}
							} else {
								return a.sent[3] - b.sent[3];
							}
						} else {
							return a.sent[2] - b.sent[2];
						}
					} else {
						return a.sent[1] - b.sent[1];
					}
				} else {
					return a.sent[0] - b.sent[0];
				}
			});
			this.setState({
				notifications: result
			});
		});
	}

	markAsRead(userId, truckId, sent, index) {
		Axios.changeNotificationStatus(userId, truckId, sent).then(result => {
			this.setState(state => {
				const notifications = state.notifications.map((note, i) => {
					if(i === index) {
						note.viewed = true;
						return note;
					} else {
						return note;
					}
				});

				return {
					notifications,
				};
			});
		});
	}

	removeNotification(userId, truckId, sent, index) {
		Axios.removeNotification(userId, truckId, sent).then(result => {
			let array = this.state.notifications;
			array.splice(index, 1);
			this.setState({
				notifications: array
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
								<ListGroupItem disabled={note.viewed}>
									<Container>
										<Row>{note.from + ': ' + note.message}</Row>
										<Row>{note.sent[1] + '/' + note.sent[2] + '/' + note.sent[0]}</Row>
										<br />
										<Row>
											<Col sm={{ size: 'auto' }}>
												<Button
													color="primary"
													size="sm"
													onClick={() => this.markAsRead(this.state.user.id, note.truckID, note.sent, index)}
													disabled={note.viewed}
												>
													Mark as Read
												</Button>
											</Col>
											<Col sm={{ size: 'auto' }}>
												<Button
													color="danger"
													size="sm"
													onClick={() => this.removeNotification(this.state.user.id, note.truckID, note.sent, index)}
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
