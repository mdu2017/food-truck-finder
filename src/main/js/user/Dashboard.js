import React from 'react';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import MapContainer from 'js/GoogleMap';

export class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authentication: Axios.getCookie('authentication'),
			username: JSON.parse(Axios.getCookie('user')),
		};
	}

	displayCustomWelcome() {
		if (this.state.authentication) {
			return (
				<div>
					{'Welcome, '}
					{this.state.username.username}
					{'!'}
				</div>
			);
		}
		return <div>{'Welcome!'} </div>;
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>{this.displayCustomWelcome()}</h1>
					<NavBars.SidebarNav />

                    {/*Render map*/}
                    {/*fill*/}
                    <MapContainer/>

				</div>
			</div>
		);
	}
}
