import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	ListGroup,
	ListGroupItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Spinner from 'js/images/spinner.gif';

export class SearchFoodTrucks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// owner_id: JSON.parse(Axios.getCookie('user')).id,
			searchResults: [],
			loadingSearch: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	setSearchFT = searchFT => this.setState({ searchFT });

	// TODO: Get details page working with searches
	// Search functionality not working if user isn't logged in (401 error unauthorized)
	//Submit handler
	handleSubmit = event => {
		this.setState({ loadingSearch: true });
		setTimeout(
			function() {
				this.setState({ loadingSearch: true }, () => {
					this.props
						.searchFoodTrucks(this.state.searchFT)
						.then(result => {
							this.setState({
								loadingSearch: false,
								searchResults: result
							});
							//window.location.href = '/#/search-trucks';
						});
				});
			}.bind(this),
			250
		);
		event.preventDefault();
	};

	renderSearchResults() {
		return (
			<div>
				{this.state.loadingSearch ? (
					<img src={Spinner} width={70} height={70} mode="fit" />
				) : (
					<div>
						<br />
						{this.state.searchResults &&
						this.state.searchResults.length > 0 ? (
							<div>
								{this.state.searchResults.map(
									(truck, index) => (
										<ListGroup key={index}>
											<ListGroupItem>
												<Link
													to={`/food-truck-details/${truck.id}`}
												>
													<h6>{truck.name}</h6>
												</Link>
												<h8>{truck.description}</h8>
											</ListGroupItem>
										</ListGroup>
									)
								)}
							</div>
						) : this.state.searchFT ? (
							<div>
								<h6>No trucks found.</h6>
							</div>
						) : null}
					</div>
				)}
			</div>
		);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Search for a Food Truck</h1>
					<br />
					<Form onSubmit={this.handleSubmit}>
						<FormGroup>
							<Input
								type="text"
								name="name"
								id="ftName"
								placeholder="Search Food Truck"
								onChange={e => this.setSearchFT(e.target.value)}
							/>
						</FormGroup>
					</Form>
					{/*Display list of food trucks by name search*/}
					{this.renderSearchResults()}
				</div>
			</div>
		);
	}
}

SearchFoodTrucks = connect(
	() => ({}),
	dispatch => ({
		searchFoodTrucks: searchFT =>
			dispatch(Axios.Actions.searchFoodTrucks(searchFT))
	})
)(SearchFoodTrucks);

// this.props.searchFoodTrucks({
//     name: this.state.name,
// });

// Axios.searchFoodTrucks(this.state.name).then(result => {
//     this.setState({ trucks: result });
// });
