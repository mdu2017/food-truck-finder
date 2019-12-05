import React from 'react';
import * as Axios from './axios';
import * as NavBars from 'js/navBars';
import {ListGroup, ListGroupItem} from 'reactstrap';
import {Link} from 'react-router-dom';

export class Events extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events: []
		};
	}

	componentDidMount() {
		Axios.getAllEvents().then(result => this.setState({ events: result }));
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Events</h1>
					{this.state.events.length > 0 ? (
						this.state.events.map((event, index) => (
							<ListGroup key={index}>
								<Link to={'/events/' + event.event_ID}>
									<ListGroupItem>
										{event.name + ': ' + event.description}
									</ListGroupItem>
								</Link>
							</ListGroup>
							)
						)
					) : null }

				</div>
			</div>
		);
	}
}
