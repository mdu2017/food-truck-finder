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
			this.setState({
				notifications: result
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
										<Row>{note}</Row>
										<br />
										<Row>
											<Col sm={{ size: 'auto' }}>
												<Button
													color="primary"
													size="sm"
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
