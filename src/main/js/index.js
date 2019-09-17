import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import * as Pages from 'js/pages';

export default class Index extends React.Component {
	render() {
		return (
			<HashRouter>
				<div>
					<Route exact path="/" component={Pages.Home} />
					<Route exact path="/user" component={Pages.HomeUser} />
					<Route exact path="/register" component={Pages.RegisterPage} />
					<Route exact path="/login" component={Pages.LoginPage} />
					<Route exact path="/events" component={Pages.EventsPage} />
					<Route exact path="/events/event" component={Pages.EventDetailsPage} />
					<Route exact path="/help" component={Pages.HelpPage} />
					<Route exact path="/forgot-password" component={Pages.ForgotPasswordPage} />
					<Route exect path="/view-profile" component={Pages.ViewProfilePage} />
					<Route exect path="/user/edit-user" component={Pages.EditUserPage} />
					<Route exact path="/search-trucks" component={Pages.SearchTrucksPage} />
					<Route exact path="/food-truck-details" component={Pages.ViewFoodTruckDetailsPage} />
					<Route exact path="/search-users" component={Pages.SearchUsersPage} />
					<Route exact path="/user/notifications" component={Pages.NotificationsPage} />
					<Route exact path="/about-free-tank-top" component={Pages.AboutUsPage} />
					<Route exact path="/owner" component={Pages.HomeOwner} />
					<Route exact path="/owner/create-remove-food-truck" component={Pages.CreateRemoveFoodTruckPage} />
					<Route exact path="/owner/edit-food-truck" component={Pages.EditFoodTruckPage} />
					<Route exact path="/owner/edit-food-truck/edit-route-schedule"
						   component={Pages.EditRouteSchedulePage} />
					<Route exact path="/owner/create-event" component={Pages.CreateEventPage} />
					<Route exact path="/owner/create-special" component={Pages.CreateSpecialPage} />
					<Route exact path="/page-1" component={Pages.Page1} />
					<Route exact path="/page-2" component={Pages.Page2} />
					<Route exact path="/page-3" component={Pages.Page3} />
				</div>
			</HashRouter>
		);
	}
}