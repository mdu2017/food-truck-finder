import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import MapContainer from 'js/Maps';
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

// const divStyle = {
// 	flex: 1,
// 	flexDirection: 'column',
// 	justifyContent: 'flex-start',
// };

export class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authentication: Axios.getCookie('authentication'),
			user: JSON.parse(Axios.getCookie('user')),
			recommendedFoodTrucks: [],
			nearbyFoodTrucks: [],
			notifications: [],
			searchFT: null,
			searchResults: [],
			loadingSearch: false,
			loadingRecommended: true,
			loadingNearby: true,
			recommendationRadius: 0.5,
			nearbyRadius: 0.5
		};
		this.handleSubmit = this.handleSubmit.bind(this);
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
				this.setState({
					notifications: result
				});
			});
		}
	}

	handleSubmit = event => {
		this.setState({ loadingSearch: true });
		setTimeout(
			function() {
				this.setState({ loadingSearch: true }, () => {
					this.props
						.searchFoodTrucks(this.state.searchFT)
						.then(result =>
							this.setState({
								loadingSearch: false,
								searchResults: result
							})
						);
				});
			}.bind(this),
			250
		);
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
					<h1>{this.displayCustomWelcome()}</h1>
					<div>
						<Container>
							<Row>
								<Col xs="2">
									<Row>
										<h4>Quick Links</h4>
										<hr />
										<Nav vertical>
											<NavItem>
												<NavLink href="#/">
													Dashboard
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href="#/events">
													Events
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													hidden={!this.state.user}
													href="#/notifications"
												>
													Notifications{' '}
													<Badge color="secondary">
														{this.state
															.notifications
															.length > 0
															? this.state
																	.notifications
																	.length
															: null}
													</Badge>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href="#/search-users">
													Search Users
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href="#/about">
													About Us
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href="#/page-1">
													Page 1
												</NavLink>
											</NavItem>
										</Nav>
									</Row>
									<br />
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
													onSubmit={this.handleSubmit}
													inline
												>
													<FormGroup inline>
														<Input
															type="text"
															name="searchFT"
															id="searchFT"
															placeholder="Search Food Trucks"
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
					{/*Render map*/}
					{/*<MapContainer/>*/}
				</div>
			</div>
		);
	}
}
Dashboard = connect(
	() => ({}),
	dispatch => ({
		searchFoodTrucks: searchFT =>
			dispatch(Axios.Actions.searchFoodTrucks(searchFT))
	})
)(Dashboard);
