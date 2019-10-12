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

class CustomNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.toggleProfile = this.toggleProfile.bind(this);
		this.state = {
			viewProfileDrop: props.viewProfileDrop,
			isLoggedIn: props.isLoggedIn
		};
	}

	displayLoginButton() {
		if (!this.state.isLoggedIn) {
			return (
				<NavLink tag={Link} to="/login">
					Login
				</NavLink>
			);
		}
		return null;
	}

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
						{/* Insert Logout Functionality */}
						<DropdownItem>Logout</DropdownItem>
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

export default CustomNavBar;
