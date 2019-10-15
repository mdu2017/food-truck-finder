import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './images/foodtruck.png';
import * as Users from 'js/backend';
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
	Col
} from 'reactstrap';
import { connect } from 'react-redux';

export class CustomNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.toggleProfile = this.toggleProfile.bind(this);
		this.state = {
			viewProfileDrop: props.viewProfileDrop,
			isLoggedIn: props.isLoggedIn
		};
	}

	logout = () => this.props.logout();

	displayLoginButton() {
		if (!Users.getCookie('user')) {
			return (
				<NavLink tag={Link} to="/login">
					Login
				</NavLink>
			);
		}
		return null;
	}

	displayViewProfile() {
		if (Users.getCookie('user')) {
			return (
				<div>
					<DropdownToggle nav caret>
						View Profile
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem tag={Link} to="/user/view-profile">
							View Profile
						</DropdownItem>
						<DropdownItem tag={Link} to="/user/edit-user">
							Manage Account
						</DropdownItem>
						<DropdownItem
							tag={Link}
							to="/owner/edit-food-truck"
							hidden={!(Users.getCookie('owner') == 'true')}>
							Edit Food Trucks
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
	logout: Users.Actions.logout()
}))(CustomNavBar);

export class SidebarNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authentication: Users.getCookie('authentication'),
			principal: Users.getCookie('email'),
			password: Users.getCookie('password'),
			username: Users.getCookie('user'),
			owner: Users.getCookie('owner')
		};
	}

	render() {
		return (
			<div>
				<Container>
					<Row>
						<Col xs="3">
							<p>Quick Links</p>
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
										hidden={!this.state.authentication}
										href="#/user/notifications">
										Notifications
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
									<NavLink href="#/about">About Us</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="#/page-1">Page 1</NavLink>
								</NavItem>
							</Nav>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}
