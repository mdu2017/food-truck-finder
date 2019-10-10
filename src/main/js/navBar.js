import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './foodtruck.png';
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
			ProfileOpen: false,
			isLoginPage: props.isLoginPage
		};
	}

	displayLoginButton() {
		if (!this.state.isLoginPage) {
			return (
				<NavLink tag={Link} to="/login">
					Login
				</NavLink>
			);
		}
		return null;
	}

	toggleProfile() {
		this.setState({
			ProfileOpen: !this.state.ProfileOpen
		});
	}

	render() {
		return (
			<div>
				<Navbar color="light" light expand="md">
					<NavbarBrand href="/">Food Truck Finder</NavbarBrand>
					<img src={Logo} width={30} height={30} mode="fit" />
					<NavbarToggler onClick={this.toggleProfile} />
					<Collapse isOpen={this.state.ProfileOpen} navbar>
						<Nav className="ml-auto" navbar>
							<UncontrolledDropdown nav inNavbar>
								<DropdownToggle nav caret>
									View Profile
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem tag={Link} to="/view-profile">
										View Profile
									</DropdownItem>
									<DropdownItem>Manage Account</DropdownItem>
									<DropdownItem divider />
									{/* Insert Logout Functionality */}
									<DropdownItem>Logout</DropdownItem>
								</DropdownMenu>
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
