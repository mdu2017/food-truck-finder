import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import * as Pages from './TestingPages';
import { Link } from 'react-router-dom';

// User Pages
import { ViewProfile } from './user/ViewProfile';
import { Dashboard } from './user/Dashboard';
import { EditProfile } from './user/EditProfile';
import { CreateAccount } from './user/CreateAccount';
import { ForgotPassword } from './user/ForgotPassword';
import { Login } from './user/Login';
import { Notifications } from './user/Notifications';
import { ViewEventDetails } from './user/ViewEventDetails';
import {SearchFoodTrucks, SearchTrucks} from './SearchTrucks';
import { SearchUsers } from './user/SearchUsers';
import { ViewOtherProfile } from 'js/user/ViewOtherProfile';
// Food Truck Pages
import { Events } from './foodtruck/Events';
import { CreateFoodTruck } from './foodtruck/CreateFT';
import { OwnedFoodTrucks } from './foodtruck/OwnedFTs';
import { EditFoodTruck } from './foodtruck/EditFT';
import { EditRouteSchedule } from './foodtruck/EditRouteSchedule';
import { CreateEvent } from './foodtruck/CreateEvent';
import { CreateSpecial } from './foodtruck/CreateSpecial';
import { ViewFoodTruckDetails } from './foodtruck/ViewFTDetails';
// System Pages
import { HelpPage } from './HelpPage';
import { AboutUs } from './AboutUs';

export default class Index extends React.Component {
	render() {
		return (
			<HashRouter>
				<div>
					<Route exact path="/" component={Dashboard} />
					<Route exact path="/register" component={CreateAccount} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/events" component={Events} />
					<Route exact path="/event" component={ViewEventDetails} />
					<Route exact path="/help" component={HelpPage} />
					<Route
						exact
						path="/forgot-password"
						component={ForgotPassword}
					/>
					<Route exect path="/view-profile" component={ViewProfile} />
					<Route exect path="/edit-user" component={EditProfile} />
					<Route
						exact
						path="/search-trucks"
						component={SearchFoodTrucks}
					/>
					{/*<Route*/}
					{/*	exact*/}
					{/*	path="/food-truck-details/:foodtruckID"*/}
					{/*	component={ViewFoodTruckDetails}*/}
					{/*/>*/}
					<Route
						exact
						path="/food-truck-details"
						component={ViewFoodTruckDetails}
					/>
					<Route exact path="/search-users" component={SearchUsers} />
					<Route
						exact
						path="/notifications"
						component={Notifications}
					/>
					<Route exact path="/about" component={AboutUs} />
					<Route
						exact
						path="/create-food-truck"
						component={CreateFoodTruck}
					/>
					<Route
						exact
						path="/edit-food-truck/:foodtruckId"
						component={EditFoodTruck}
					/>
					<Route
						exact
						path="/list-food-trucks"
						component={OwnedFoodTrucks}
					/>
					<Route
						exact
						path="/edit-food-truck/:foodtruckId/edit-route-schedule"
						component={EditRouteSchedule}
					/>
					<Route exact path="/create-event" component={CreateEvent} />
					<Route
						exact
						path="/create-special"
						component={CreateSpecial}
					/>
					<Route exact path="/page-1" component={Pages.Page1} />
					<Route exact path="/hello" component={Pages.HelloSend} />
					<Route exact
						   path="/user/:username"
						   component={ViewOtherProfile}
					/>
				</div>
			</HashRouter>
		);
	}
}
