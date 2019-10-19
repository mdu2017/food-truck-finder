import React from 'react';
import * as NavBars from 'js/navBars';

export class Notifications extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Notifications</h1>
				</div>
			</div>
		);
	}
}
