import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import MapContainer from 'js/Maps';
import {DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown} from 'reactstrap';
import {
	Badge,
	Col,
	Container,
	Nav,
	NavItem,
	NavLink,
	Row,
	Form,
	FormGroup,
	Input,
	Button,
	ListGroup,
	ListGroupItem
} from 'reactstrap';
import Spinner from 'js/images/spinner.gif';

export class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		//Bind toggle and select for dropdown
		this.toggle = this.toggle.bind(this);
		this.select = this.select.bind(this);

		this.state = {
			authentication: Axios.getCookie('authentication'),
			user: JSON.parse(Axios.getCookie('user')),
			recommendedFoodTrucks: [],
			nearbyFoodTrucks: [],
			notifications: null,
			searchFT: null,
			searchResults: [],
			loadingSearch: false,
			loadingRecommended: true,
			loadingNearby: true,
			recommendationRadius: 0.5,
			nearbyRadius: 0.5,

			dropdownOpen: false,
			dropdownValue: 'Truck Name'
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	//Toggle dropdown open
	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	//Select filter
	select(event) {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
			dropdownValue: event.target.innerText
		});
	}

	setSearchFT = searchFT => this.setState({ searchFT });

	setRecommendationRadius = recommendationRadius => {
		this.setState({ loadingRecommended: true });
		this.setState({ recommendationRadius: recommendationRadius });
		this.updateRecommendedDistance();
	};

	setNearbyRadius = nearbyRadius => {
		this.setState({ loadingNearby: true });
		this.setState({ nearbyRadius: nearbyRadius });
		this.updateNearbyDistance();
	};

	componentDidMount() {
		this.updateRecommendedDistance();
		this.updateNearbyDistance();
		if (this.state.user) {
			Axios.getNotifications(this.state.user.id).then(result => {
				let notes = 0;
				result.forEach(note => {
					if (note.viewed === false) {
						notes++;
					}
				});
				this.setState({
					notifications: notes
				});
			});
		}
	}

	//TODO: Different search by filter
	handleSubmit = event => {
		this.setState({ loadingSearch: true });

		//Truck name filter
		if(this.state.dropdownValue === 'Truck Name') {
			setTimeout(
				function () {
					this.setState({loadingSearch: true}, () => {
						Axios.searchFoodTrucks(this.state.searchFT).then(result => {
							this.setState({
								loadingSearch: false,
								searchResults: result
							});
							//TODO: This is for new page for search result
							// window.location.href = '/#/search-trucks';
						});
					});
				}.bind(this),
				250
			);
		}
		else if(this.state.dropdownValue === 'Food Type'){
			setTimeout(
				function () {
					this.setState({loadingSearch: true}, () => {
						Axios.searchFoodTrucksByType(this.state.searchFT).then(result => {
							this.setState({
								loadingSearch: false,
								searchResults: result
							});
						});
					});
				}.bind(this),
				250
			);
		}
		//TODO: do max price
		else if(this.state.dropdownValue === 'Price'){
			setTimeout(
				function () {
					this.setState({loadingSearch: true}, () => {
						Axios.searchTrucksByPrice(this.state.searchFT).then(result => {
							this.setState({
								loadingSearch: false,
								searchResults: result
							});
						});
					});
				}.bind(this),
				250
			);
		}
		//TODO: use nearby location algorithm in backend
		else if(this.state.dropdownValue === 'Distance'){
			console.log(' ');
		}

		event.preventDefault();
	};

	displayCustomWelcome() {
		if (this.state.authentication) {
			return (
				<div>
					{'Welcome, '}
					{this.state.user.username}
					{'!'}
				</div>
			);
		}
		return <div>{'Welcome!'} </div>;
	}

	updateRecommendedDistance() {
		setTimeout(
			function() {
				this.setState({ loadingRecommended: true }, () => {
					navigator.geolocation.getCurrentPosition(position => {
						Axios.getRecommendations(
							position.coords.latitude,
							position.coords.longitude,
							this.state.recommendationRadius
						).then(result =>
							this.setState({
								loadingRecommended: false,
								recommendedFoodTrucks: result
							})
						);
					});
				});
			}.bind(this),
			250
		);
	}

	updateNearbyDistance() {
		setTimeout(
			function() {
				this.setState({ loadingNearby: true }, () => {
					navigator.geolocation.getCurrentPosition(position => {
						Axios.getNearby(
							position.coords.latitude,
							position.coords.longitude,
							this.state.nearbyRadius
						).then(result =>
							this.setState({
								loadingNearby: false,
								nearbyFoodTrucks: result
							})
						);
					});
				});
			}.bind(this),
			250
		);
	}

	//Display search results
	renderSearchResults() {
		return (
			<div>
				{this.state.loadingSearch ? (
					<img src={Spinner} width={60} height={60} mode="fit" />
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
					<h1>{this.displayCustomWelcome()}</h1>
					<div>
						<Container>
							<Row>
								<Col xs="2">
									<Row>
										<div>
											<h4>Nearby</h4>
											<hr />
											<Button
												color="info"
												size="sm"
												onClick={() => {
													if (
														this.state
															.nearbyRadius -
															0.143 <
														0
													) {
														this.setNearbyRadius(0);
													} else {
														this.setNearbyRadius(
															this.state
																.nearbyRadius -
																0.143
														);
													}
												}}
											>
												-
											</Button>{' '}
											<h8>
												Radius:{' '}
												{(
													this.state.nearbyRadius * 70
												).toFixed(0)}{' '}
												mi
											</h8>{' '}
											<Button
												color="info"
												size="sm"
												onClick={() =>
													this.setNearbyRadius(
														this.state
															.nearbyRadius +
															0.143
													)
												}
											>
												+
											</Button>
											<br />
											{this.state.loadingNearby ? (
												<img
													src={Spinner}
													width={70}
													height={70}
													mode="fit"
												/>
											) : this.state.nearbyFoodTrucks &&
											  this.state.nearbyFoodTrucks
													.length > 0 ? (
												<Nav>
													<NavItem>
														{this.state.nearbyFoodTrucks.map(
															(
																foodtruck,
																index
															) => {
																return (
																	<NavLink
																		key={
																			index
																		}
																		href={
																			'/#/food-truck-details/' +
																			foodtruck.id
																		}
																	>
																		{
																			foodtruck.name
																		}
																	</NavLink>
																);
															}
														)}
													</NavItem>
												</Nav>
											) : (
												<span>No Results</span>
											)}
										</div>
									</Row>
								</Col>
								<Col>
									<Row>
										{/* md={{ size: 6, offset: 3 }} */}
										<Col sm="12">
											<div>
												<Form
													onChange={this.handleSubmit}
													inline
												>

													{/*Search filter*/}
													<ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
														<DropdownToggle caret>
															{this.state.dropdownValue}
														</DropdownToggle>
														<DropdownMenu>
															<DropdownItem onClick={this.select}>Truck Name</DropdownItem>
															<DropdownItem onClick={this.select}>Food Type</DropdownItem>
															<DropdownItem onClick={this.select}>Price</DropdownItem>
															<DropdownItem onClick={this.select}>Distance</DropdownItem>
														</DropdownMenu>
													</ButtonDropdown>

													<FormGroup inline>
														<Input
															type="text"
															name="searchFT"
															id="searchFT"
															placeholder="Search"
															onChange={e =>
																this.setSearchFT(
																	e.target
																		.value
																)
															}
														/>
													</FormGroup>
												</Form>
												{this.renderSearchResults()}
											</div>
										</Col>

									</Row>
								</Col>
								<Col xs="3">
									<div>
										<h4>Recommended</h4>
										<hr />
										<Container>
											<Col md={{ offset: 1 }}>
												<Button
													color="info"
													size="sm"
													onClick={() => {
														if (
															this.state
																.recommendationRadius -
																0.143 <
															0
														) {
															this.setRecommendationRadius(
																0
															);
														} else {
															this.setRecommendationRadius(
																this.state
																	.recommendationRadius -
																	0.143
															);
														}
													}}
												>
													-
												</Button>{' '}
												<h8>
													Radius:{' '}
													{(
														this.state
															.recommendationRadius *
														70
													).toFixed(0)}{' '}
													mi
												</h8>{' '}
												<Button
													color="info"
													size="sm"
													onClick={() =>
														this.setRecommendationRadius(
															this.state
																.recommendationRadius +
																0.143
														)
													}
												>
													+
												</Button>
											</Col>
											<br />
										</Container>
										{this.state.loadingRecommended ? (
											<img
												src={Spinner}
												width={70}
												height={70}
												mode="fit"
											/>
										) : this.state.recommendedFoodTrucks &&
										  this.state.recommendedFoodTrucks
												.length > 0 ? (
											<Nav>
												<NavItem>
													{this.state.recommendedFoodTrucks.map(
														(foodtruck, index) => {
															return (
																<NavLink
																	key={index}
																	href={
																		'/#/food-truck-details/' +
																		foodtruck.id
																	}
																>
																	{
																		foodtruck.name
																	}
																</NavLink>
															);
														}
													)}
												</NavItem>
											</Nav>
										) : (
											<span>No Results</span>
										)}
									</div>
								</Col>
							</Row>
						</Container>
					</div>
				</div>

				{/*Render map*/}
				<MapContainer />
			</div>
		);
	}
}
