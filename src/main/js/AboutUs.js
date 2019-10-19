import React from 'react';
import * as NavBars from 'js/navBars';

export class AboutUs extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>About Us</h1>
				</div>
			</div>
		);
	}
}
