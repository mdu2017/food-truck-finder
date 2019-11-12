import React from 'react';
import * as NavBars from 'js/navBars';
import * as Axios from 'js/axios';

export class Notifications extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: JSON.parse(Axios.getCookie('user')),
			notifications: []
		};
	}

	componentDidMount() {
		Axios.getNotifications(this.state.user.id).then(result => {
			console.log(result);
			this.setState({
				notifications: result
			});
		});
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar/>
				<div className="container padded">
					<h1>Notifications</h1>
					<ul>
					{this.state.notifications ? (this.state.notifications.map((note, index) => (
						<li key={index}>{note}</li>
					))) : null}
					</ul>
				</div>
			</div>
		);
	}
}
