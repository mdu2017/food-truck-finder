import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Multiselect } from 'multiselect-react-dropdown';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import DashboardMap from 'js/DashboardMap';
import {
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	ButtonDropdown
} from 'reactstrap';
import {
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
	ListGroupItem,
	Pagination,
	PaginationItem,
	PaginationLink
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
			numberOfPages: 0,
			loadingSearch: false,
			loadingRecommended: true,
			loadingNearby: true,
			recommendationRadius: 0.03,
			nearbyRadius: 0.03,
			spinnerHeight: 60,
			spinnerWidth: 60,
			dropdownOpen: false,
			dropdownValue: 'Truck Name',
			options: [
				'AMERICAN',
				'BBQ',
				'BREAKFAST',
				'CHINESE',
				'DESERT',
				'HEALTHY',
				'INDIAN',
				'MEDITERRANEAN',
				'MEXICAN',
				'PIZZA',
				'SEAFOOD',
				'VEGAN',
				'VEGETARIAN',
				'VIETNAMESE'
			],

			choices: []
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	//Item that is selected.
	onSelect = (optionList, selectedItem) => {
		console.log('Selected item is ' + selectedItem);

		this.setState({
			choices: optionList
		});

		this.handleSubmit();
	};

	//Item that is removed when using food type filter (*backspace removes index)
	onRemove = (optionList, removedItem) => {
		console.log('removed item is ' + removedItem);

		this.setState({
			choices: optionList
		});

		this.handleSubmit();
	};

	msDropdown() {
		return (
			<Multiselect
				id={'dashboardMS'}
				options={this.state.options}
				onSelect={this.onSelect} // Function will trigger on select event
				onRemove={this.onRemove} // Function will trigger on remove event
				isObject={false}
				placeholder={'Select Food Type'}
			/>
		);
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

	//Search feature
	handleSubmit = event => {
		console.log('testing testing this is called');
		this.setState({ loadingSearch: true });

		//Truck name filter
		if (this.state.dropdownValue === 'Truck Name') {
			setTimeout(
				function() {
					this.setState({ loadingSearch: true }, () => {
						Axios.searchFoodTrucks(this.state.searchFT).then(
							result => {
								this.setState({
									loadingSearch: false,
									searchResults: result
								});
								//TODO: This is for new page for search result
								// window.location.href = '/#/search-trucks';
							}
						);
					});
				}.bind(this),
				250
			);

			event.preventDefault();
		} else if (this.state.dropdownValue === 'Food Type') {
			setTimeout(
				function() {
					this.setState({ loadingSearch: true, searchResults: [] });

					this.state.choices.forEach(choice => {
						Axios.searchFoodTrucksByType(choice).then(result => {
							result.forEach(truck =>
								this.setState(state => {
									const searchResults = state.searchResults.concat(
										truck
									);

									return {
										searchResults
									};
								})
							);
						});
					});

					this.setState({ loadingSearch: false });
				}.bind(this),
				250
			);
		} else if (this.state.dropdownValue === 'Price') {
			setTimeout(
				function() {
					this.setState({ loadingSearch: true }, () => {
						Axios.searchTrucksByPrice(this.state.searchFT).then(
							result => {
								this.setState({
									loadingSearch: false,
									searchResults: result
								});
							}
						);
					});
				}.bind(this),
				250
			);

			event.preventDefault();
		} else if (this.state.dropdownValue === 'Distance') {
			setTimeout(
				function() {
					this.setState({ loadingSearch: true }, () => {
						navigator.geolocation.getCurrentPosition(position => {
							Axios.searchTrucksByDistance(
								position.coords.latitude,
								position.coords.longitude,
								this.state.searchFT
							).then(result =>
								this.setState({
									loadingSearch: false,
									searchResults: result
								})
							);
						});
					});
				}.bind(this),
				250
			);

			event.preventDefault();
		}
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
		console.log(this.state.searchResults);
		if (this.state.searchResults != null) {
			this.state.numberOfPages = this.state.searchResults.length / 5;
			if (!(this.state.numberOfPages < 1)) {
				this.state.numberOfPages += this.state.searchResults.length % 5;
			}

			console.log(this.state.numberOfPages);
		}
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
												<h6>{truck.description}</h6>
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

	renderPageNumbers() {
		let render = [];
		for (let i = 1; i <= this.state.numberOfPages; i++) {
			render.push(
				<PaginationItem>
					<PaginationLink href="#">{i}</PaginationLink>
				</PaginationItem>
			);
		}
		return (
			<div>
				<Pagination>{render}</Pagination>
			</div>
		);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>{this.displayCustomWelcome()}</h1>
					<br />
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
											Radius:{' '}
											{(
												this.state.nearbyRadius * 70
											).toFixed(0)}{' '}
											mi{' '}
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
													width={
														this.state.spinnerWidth
													}
													height={
														this.state.spinnerHeight
													}
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
											<h4>Recommended</h4>
											<hr />
											{this.state.loadingRecommended ? (
												<img
													src={Spinner}
													width={
														this.state.spinnerWidth
													}
													height={
														this.state.spinnerHeight
													}
													mode="fit"
												/>
											) : this.state
													.recommendedFoodTrucks &&
											  this.state.recommendedFoodTrucks
													.length > 0 ? (
												<Nav>
													<NavItem>
														{this.state.recommendedFoodTrucks.map(
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
								<Col xs="4.7">
									<Row>
										{/* md={{ size: 6, offset: 3 }} */}
										<Form
											onChange={this.handleSubmit}
											inline
										>
											{/*Search filter*/}
											<ButtonDropdown
												isOpen={this.state.dropdownOpen}
												toggle={this.toggle}
											>
												<DropdownToggle caret>
													{this.state.dropdownValue}
												</DropdownToggle>
												<DropdownMenu>
													<DropdownItem
														onClick={this.select}
													>
														Truck Name
													</DropdownItem>
													<DropdownItem
														onClick={this.select}
													>
														Food Type{' '}
													</DropdownItem>
													<DropdownItem
														onClick={this.select}
													>
														Price
													</DropdownItem>
													<DropdownItem
														onClick={this.select}
													>
														Distance
													</DropdownItem>
												</DropdownMenu>
												{this.state.dropdownValue ===
													'Food Type' &&
													this.msDropdown()}
											</ButtonDropdown>

											{/* TODO: Multi select*/}

											{console.log('Current list: ')}
											{console.log(this.state.choices)}

											{this.state.dropdownValue !==
												'Food Type' && (
												<FormGroup inline>
													<Input
														type="text"
														name="searchFT"
														id="searchFT"
														placeholder="Search"
														onChange={e =>
															this.setSearchFT(
																e.target.value
															)
														}
													/>
												</FormGroup>
											)}
										</Form>
									</Row>
									{this.renderSearchResults()}
								</Col>
								&nbsp; &nbsp; &nbsp;
								<Col
									style={{
										height: '420px',
										width: '620px'
									}}
									// md={{
									// 	size: 'auto'
									// }}
								>
									<DashboardMap />
								</Col>
							</Row>
						</Container>
					</div>
				</div>
			</div>
		);
	}
}
