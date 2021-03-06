import React from 'react';
import { Link } from 'react-router-dom';
import Logo from 'js/images/foodtruck.png';
import Hamburger from 'js/images/hamburger.png';
import * as Axios from 'js/axios';
import {
	Badge,
	Col,
	Collapse,
	Container,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Nav,
	Navbar,
	NavbarBrand,
	NavbarToggler,
	NavItem,
	NavLink,
	Row,
	UncontrolledDropdown
} from 'reactstrap';
import { connect } from 'react-redux';

export class CustomNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.toggleProfile = this.toggleProfile.bind(this);
		this.state = {
			viewProfileDrop: props.viewProfileDrop,
			viewHamburger: false,
			notificationsNumber: null,
			user: JSON.parse(Axios.getCookie('user'))
		};
		this.getNotifications();
	}

	logout = () => this.props.logout();

	getNotifications() {
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

	displayHamburger() {
		return (
			<div>
				<DropdownToggle nav>
					<img src={Hamburger} width={30} height={30} mode="fit" />
					<Badge color="primary">
						{this.state.notifications
							? this.state.notifications
							: null}
					</Badge>
				</DropdownToggle>
				<DropdownMenu right>
					<DropdownItem
						hidden={!this.state.user}
						tag={Link}
						to="/view-profile"
					>
						View Profile
					</DropdownItem>
					<DropdownItem
						hidden={!this.state.user}
						href="#/notifications"
					>
						Notifications{' '}
						<Badge color="primary">
							{this.state.notifications
								? this.state.notifications
								: null}
						</Badge>
					</DropdownItem>
					<DropdownItem
						hidden={!this.state.user}
						tag={Link}
						to="/edit-user"
					>
						Edit Account
					</DropdownItem>
					{this.state.user && (
						<DropdownItem
							tag={Link}
							to="/list-food-trucks"
							hidden={this.state.user.isOwner !== true}
						>
							Manage Trucks
						</DropdownItem>
					)}
					{this.state.user && (
						<DropdownItem
							tag={Link}
							to="/create-food-truck"
							hidden={this.state.user.isOwner !== true}
						>
							Add Food Truck
						</DropdownItem>
					)}
					<DropdownItem hidden={!this.state.user} divider />
					<DropdownItem href="#/">Dashboard</DropdownItem>
					<DropdownItem href="#/events">Events</DropdownItem>
					<DropdownItem href="#/search-users">
						Search Users
					</DropdownItem>
					<DropdownItem href="#/about">About Us</DropdownItem>
					{/* <DropdownItem href="#/page-1">Page 1</DropdownItem> */}
					{this.state.user && <DropdownItem divider />}
					{this.state.user && (
						<DropdownItem onClick={this.logout}>
							Logout
						</DropdownItem>
					)}
				</DropdownMenu>
			</div>
		);
	}

	toggleProfile() {
		this.setState({
			viewProfileDrop: !this.state.viewProfileDrop
		});
	}

	toggleHamburger() {
		this.setState({
			viewHamburger: !this.state.viewHamburger
		});
	}

	render() {
		return (
			<div>
				<Navbar
					style={{ backgroundColor: '#00CF69' }}
					light
					expand="md"
				>
					<NavbarBrand href="/">Food Truck Finder</NavbarBrand>
					<img src={Logo} width={30} height={30} mode="fit" />
					<NavbarToggler onClick={this.toggleProfile} />
					<Collapse isOpen={this.state.viewProfileDrop} navbar>
						{!this.state.user ? (
							<Nav className="ml-auto" navbar>
								<NavItem>
									<NavLink tag={Link} to="/register">
										Sign Up
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink disabled>{' | '}</NavLink>
								</NavItem>
								<NavItem>
									<NavLink tag={Link} to="/login">
										Login
									</NavLink>
								</NavItem>
								<UncontrolledDropdown nav innavbar="true">
									{this.displayHamburger()}
								</UncontrolledDropdown>
							</Nav>
						) : (
							<Nav className="ml-auto" navbar>
								<UncontrolledDropdown nav innavbar="true">
									{this.displayHamburger()}
								</UncontrolledDropdown>
							</Nav>
						)}
					</Collapse>
				</Navbar>
			</div>
		);
	}
}

CustomNavBar = connect(() => ({
	logout: Axios.Actions.logout()
}))(CustomNavBar);

export class SidebarNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: JSON.parse(Axios.getCookie('user')),
			foodtrucks: []
		};
	}

	// showPosition(position) {
	// 	Axios.getRecommendations(
	// 		position.coords.latitude,
	// 		position.coords.longitude
	// 	).then(function(result) {
	// 		document.cookie =
	// 			'recommendations=' + JSON.stringify(result) + '; path=/';
	// 	});
	// }

	componentDidMount() {

		this.setState({
			foodtrucks: JSON.parse(Axios.getCookie('recommendations'))
		});
	}

	render() {
		if (!this.state.foodtrucks) {
			return <div />;
		}

		return (
			<div>
				<Container>
					<Row>
						<Col xs="3">
							<h4>Quick Links</h4>
							<hr />
							<Nav vertical>
								<NavItem>
									<NavLink href="#/">Dashboard</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="#/events">Events</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										hidden={!this.state.user}
										href="#/notifications"
									>
										Notifications{' '}
										<Badge color="secondary">4</Badge>
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="#/search-trucks">
										Search Food Trucks
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink disabled href="#/search-users">
										Search Users
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="#/about">About Us</NavLink>
								</NavItem>
								{/* <NavItem>
									<NavLink href="#/page-1">Page 1</NavLink>
								</NavItem> */}
							</Nav>
							<div>
								<h4>Recommendations</h4>
								{this.state.foodtrucks ? (
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
		);
	}
}
