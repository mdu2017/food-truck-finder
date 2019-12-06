import React from 'react';
import * as NavBars from 'js/navBars';

export class HelpPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Help Page</h1>
					<p>To use our application, please consult the User Manual</p>
				</div>
			</div>
		);
	}
}
