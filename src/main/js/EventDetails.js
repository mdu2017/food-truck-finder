import React from 'react';
import * as NavBars from 'js/navBars';
import * as Axios from 'js/axios';
import {ListGroup, ListGroupItem} from 'reactstrap';
import Link from 'react-router-dom/Link';

export class EventDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			event: null,
			trucks: []
		};
	}

	componentDidMount() {
		const URLObject = this.props.match.params;
		var { event_ID: id } = URLObject;

		Axios.getEventByID(id).then(result => {
			this.setState({ event: result });
		});

		Axios.getAttendingTrucks(id).then(result => {
			this.setState({ trucks: result });
		});
	}

	render() {
		return (
            <div>
                <NavBars.CustomNavBar />
	            {this.state.event ? (
                <div className="container padded">
                    <h1>Event: {this.state.event.name}</h1>
					<h2>Description: {this.state.event.description}</h2>
                    <h3>Attending Food Trucks</h3>
	                {this.state.trucks.length > 0 ? (
		                this.state.trucks.map((truck, index) => (
			                <ListGroup key={index}>
				                <Link to={'/food-truck-details/' + truck.id}>
					                <ListGroupItem>
						                {truck.name}
					                </ListGroupItem>
				                </Link>
			                </ListGroup>
			                )
		                )
	                ): null }
	                {this.state.event.stop ? (
                        <h3>
	                        Date: {this.state.event.stop.start}
                            Time: {this.state.event.stop.start}-{this.state.event.end}
                        </h3>
		                ): (<h3> Location and time is pending </h3>)}
                </div>
		            ): null}
            </div>
		);
	}
}
