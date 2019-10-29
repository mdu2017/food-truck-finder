import React from 'react';
import { Link } from 'react-router-dom';
import Logo from 'js/images/foodtruck.png';
import * as Axios from 'js/axios';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Container,
	Row,
	Col,
	Badge
} from 'reactstrap';
import { connect } from 'react-redux';

export class CustomNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.toggleProfile = this.toggleProfile.bind(this);
		this.state = {
			viewProfileDrop: props.viewProfileDrop,
			user: JSON.parse(Axios.getCookie('user'))
		};
	}

	logout = () => this.props.logout();

	displayLoginButton() {
		if (!this.state.user) {
			return (
				<NavLink tag={Link} to="/login">
					Login
				</NavLink>
			);
		}
		return null;
	}

	displayViewProfile() {
		if (this.state.user) {
			return (
				<div>
					<DropdownToggle nav caret>
						View Profile
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem tag={Link} to="/view-profile">
							View Profile
						</DropdownItem>
						<DropdownItem tag={Link} to="/edit-user">
							Manage Account
						</DropdownItem>
						<DropdownItem
							tag={Link}
							to="/list-food-trucks"
							hidden={this.state.user.isOwner !== true}>
							Edit Food Trucks
						</DropdownItem>
						<DropdownItem
							tag={Link}
							to="/create-food-truck"
							hidden={this.state.user.isOwner !== true}>
							Add Food Truck
						</DropdownItem>
						<DropdownItem divider />
						<DropdownItem onClick={this.logout}>
							Logout
						</DropdownItem>
					</DropdownMenu>
				</div>
			);
		}
		return null;
	}

	toggleProfile() {
		this.setState({
			viewProfileDrop: !this.state.viewProfileDrop
		});
	}

	render() {
		return (
			<div>
				<Navbar color="light" light expand="md">
					<NavbarBrand href="/">Food Truck Finder</NavbarBrand>
					<img src={Logo} width={30} height={30} mode="fit" />
					<NavbarToggler onClick={this.toggleProfile} />
					<Collapse isOpen={this.state.viewProfileDrop} navbar>
						<Nav className="ml-auto" navbar>
							<UncontrolledDropdown nav innavbar="true">
								{this.displayViewProfile()}
							</UncontrolledDropdown>
							<NavItem>{this.displayLoginButton()}</NavItem>
						</Nav>
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
		};
		navigator.geolocation.getCurrentPosition(this.showPosition);
	}

	setUserlat = userlat => this.setState({ userlat });
	setUserlong = userlong => this.setState({ userlong });

	showPosition(position) {
		Axios.getRecommendations(position.coords.latitude, position.coords.longitude);
		console.log(position.coords.latitude + ' ' + position.coords.longitude);
	}

	render() {
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
										href="#/notifications">
										Notifications{' '}
										<Badge color="secondary">4</Badge>
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink disabled href="#/search-trucks">
										Search Food Trucks
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink disabled href="#/search-users">
										Search Users
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink disabled href="#/about">
										About Us
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="#/page-1">Page 1</NavLink>
								</NavItem>
							</Nav>
							<h4>Recommendations</h4>
							<hr />
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}
