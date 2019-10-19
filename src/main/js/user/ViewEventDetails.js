import React from 'react';
import * as NavBars from 'js/navBars';

export class ViewEventDetails extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Event ___ Details</h1>
				</div>
			</div>
		);
	}
}
