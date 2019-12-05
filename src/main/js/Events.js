import React from 'react';
import * as NavBars from 'js/navBars';

export class Events extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Events</h1>
				</div>
			</div>
		);
	}
}
