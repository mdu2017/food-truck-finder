import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import * as Pages from 'js/pages';
import * as User from 'js/users';
import * as Owner from 'js/owner';

export default class Index extends React.Component {
	render() {
		return (
			<HashRouter>
				<div>
					<Route exact path="/" component={Pages.Home} />
					<Route exact path="/user" component={User.HomeUser} />
					<Route
						exact
						path="/register"
						component={Pages.RegisterPage}
					/>
					<Route exact path="/login" component={Pages.LoginPage} />
					<Route exact path="/events" component={Pages.EventsPage} />
					<Route
						exact
						path="/events/event"
						component={Pages.EventDetailsPage}
					/>
					<Route exact path="/help" component={Pages.HelpPage} />
					<Route
						exact
						path="/forgot-password"
						component={Pages.ForgotPasswordPage}
					/>
					<Route
						exect
						path="/user/view-profile"
						component={User.ViewUserProfilePage}
					/>
					<Route
						exect
						path="/user/edit-user"
						component={User.EditUserPage}
					/>
					<Route
						exact
						path="/search-trucks"
						component={Pages.SearchTrucksPage}
					/>
					<Route
						exact
						path="/food-truck-details"
						component={Pages.ViewFoodTruckDetailsPage}
					/>
					<Route
						exact
						path="/search-users"
						component={Pages.SearchUsersPage}
					/>
					<Route
						exact
						path="/customer-details"
						component={Pages.viewCustomerDetailsPage}
					/>
					<Route
						exact
						path="/user/notifications"
						component={Pages.NotificationsPage}
					/>
					<Route
						exact
						path="/about-free-tank-top"
						component={Pages.AboutUsPage}
					/>
					<Route exact path="/owner" component={Owner.Dashboard} />
					<Route
						exect
						path="/owner/view-profile"
						component={Owner.ViewOwnerProfilePage}
					/>
					<Route
						exact
						path="/owner/create-food-truck"
						component={Owner.CreateFoodTruckPage}
					/>
					<Route
						exact
						path="/owner/edit-food-truck"
						component={Owner.EditFoodTruckPage}
					/>
					<Route
						exact
						path="/owner/edit-food-truck/edit-route-schedule"
						component={Owner.EditRouteSchedulePage}
					/>
					<Route
						exact
						path="/owner/create-event"
						component={Owner.CreateEventPage}
					/>
					<Route
						exact
						path="/owner/create-special"
						component={Owner.CreateSpecialPage}
					/>
					<Route exact path="/page-1" component={Pages.Page1} />
					<Route exact path="/page-2" component={Pages.Page2} />
					<Route exact path="/page-3" component={Pages.Page3} />
					<Route exact path="/hello" component={Pages.HelloSend} />
				</div>
			</HashRouter>
		);
	}
}
