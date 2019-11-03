import React from 'react';
import { Link } from 'react-router-dom';
import * as Axios from 'js/axios';
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
				{this.state.trucks.length > 0 ? (
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
				) : (
					<div>
						<h6>No Food Trucks Created.</h6>
						<Link to={'/create-food-truck'}>
							<h6>Create One!</h6>
						</Link>
					</div>
				)}
			</div>
		);
	}

	render() {
		return (
			<div>
				<div className="container padded">
					<h1>Your Food Trucks</h1>
					{this.renderFoodTrucks()}
				</div>
			</div>
		);
	}
}
