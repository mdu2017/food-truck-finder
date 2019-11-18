import React from 'react';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import MapContainer from 'js/Maps';
import { Badge, Col, Container, Nav, NavItem, NavLink, Row } from 'reactstrap';
import { getRecommendations } from 'js/axios';
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
			foodtrucks: [],
			notifications: [],
			loading: true
		};
	}

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

	componentDidMount() {
		setTimeout(
			function() {
				this.setState({ loading: true }, () => {
					navigator.geolocation.getCurrentPosition(position => {
						Axios.getRecommendations(
							position.coords.latitude,
							position.coords.longitude
						).then(result =>
							this.setState({
								loading: false,
								foodtrucks: result
							})
						);
					});
				});
			}.bind(this),
			1000
		);
		if (this.state.user) {
			Axios.getNotifications(this.state.user.id).then(result => {
				this.setState({
					notifications: result
				});
			});
		}
	}

	render() {
		if (!this.state.foodtrucks) {
			return <div />;
		}

		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>{this.displayCustomWelcome()}</h1>
					<div>
						<Container>
							<Row>
								<Col xs="3">
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
													{this.state.notifications
														.length > 0
														? this.state
																.notifications
																.length
														: null}
												</Badge>
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink href="#/search-trucks">
												Search Food Trucks
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												disabled
												href="#/search-users"
											>
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
									<div>
										<h4>Recommended/Nearby Food Trucks</h4>
										{this.state.loading ? (
											<img
												src={Spinner}
												width={70}
												height={70}
												mode="fit"
											/>
										) : this.state.foodtrucks ? (
											<Nav>
												{this.state.foodtrucks.map(
													(foodtruck, index) => {
														return (
															<NavLink
																key={index}
																href={
																	'/#/food-truck-details/' +
																	foodtruck.id
																}
															>
																{foodtruck.name}
															</NavLink>
														);
													}
												)}
											</Nav>
										) : null}
									</div>
								</Col>
							</Row>
						</Container>
					</div>

				</div>

				{/*Render map*/}
				<MapContainer/>

			</div>
		);
	}
}
