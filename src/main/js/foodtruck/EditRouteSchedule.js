import React from 'react';
import * as NavBars from 'js/navBars';

export class EditRouteSchedule extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Edit Route Schedule</h1>
				</div>
			</div>
		);
	}
}
