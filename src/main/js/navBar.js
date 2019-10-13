import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './images/foodtruck.png';
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
	DropdownItem
} from 'reactstrap';
import {connect} from 'react-redux';
import * as Users from 'js/backend';

class CustomNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.toggleProfile = this.toggleProfile.bind(this);
		this.state = {
			viewProfileDrop: props.viewProfileDrop,
			isLoggedIn: props.isLoggedIn
		};
	}

	//Display login button if not currently logged in
	displayLoginButton() {
		if(!this.state.isLoggedIn) {
			return (
				<NavLink tag={Link} to="/login">
					Login
				</NavLink>
			);
		}
	}

	//Logout functionality
	logout = () => this.props.logout();

	//Dropdown menu for viewing profile (on user/owner homepage)
	displayViewProfile() {
		if (this.state.isLoggedIn) {
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
						<DropdownItem divider />
						{/* Insert Logout Functionality (works, but not sure if it's the best way)*/}
						<DropdownItem onClick={this.logout}>Logout</DropdownItem>
					</DropdownMenu>
				</div>
			);
		}
		return null;
	}

	//Set state for profile
	toggleProfile() {
		this.setState({
			viewProfileDrop: !this.state.viewProfileDrop
		});
	}

	//Displays the navbar with dropdown menu; login button
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

//Connect to cause logout
CustomNavBar = connect(() => ({
	authentication: Users.getCookie('authentication'),
	user: Users.getCookie('user'),
	logout: Users.Actions.logout()
}))(CustomNavBar);

export default CustomNavBar;
