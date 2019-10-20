import React from 'react';
import { Link } from 'react-router-dom';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import { ListGroup, ListGroupItem } from 'reactstrap';

export class OwnedFoodTrucks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			owner_id: JSON.parse(Axios.getCookie('user')).id,
			trucks: []
		};
	}

	componentWillMount() {
		Axios.getFoodTrucksByOwner(this.state.owner_id).then(result => {
			this.setState({ trucks: result });
		});
	}

	renderFoodTrucks() {
		return (
			<div>
				{this.state.trucks ? (
					<div>
						{this.state.trucks.map((truck, index) => (
							<ListGroup key={index}>
								<ListGroupItem>
									<Link to={`/edit-food-truck/${truck.id}`}>
										{truck.name}
									</Link>
								</ListGroupItem>
							</ListGroup>
						))}
					</div>
				) : null}
			</div>
		);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Your Food Trucks</h1>
					{this.renderFoodTrucks()}
				</div>
			</div>
		);
	}
}
