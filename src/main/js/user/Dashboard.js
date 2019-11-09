import React from 'react';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import MapContainer from 'js/Maps';

// const divStyle = {
// 	flex: 1,
// 	flexDirection: 'column',
// 	justifyContent: 'flex-start',
// };

export class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authentication: Axios.getCookie('authentication'),
			username: JSON.parse(Axios.getCookie('user'))
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
				<div className="container padded">
					<h1>{this.displayCustomWelcome()}</h1>
					<NavBars.SidebarNav />

                    {/*Render map*/}
                    <MapContainer/>

				</div>
			</div>
		);
	}
}
