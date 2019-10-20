import React from 'react';
import * as NavBars from 'js/navBars';

export class HelpPage extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Help Page</h1>
				</div>
			</div>
		);
	}
}
