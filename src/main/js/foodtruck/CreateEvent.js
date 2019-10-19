import React from 'react';
import * as NavBars from 'js/navBars';

export class CreateEvent extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Create Event</h1>
				</div>
			</div>
		);
	}
}
