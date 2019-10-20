import React from 'react';
import * as NavBars from 'js/navBars';

export class CreateSpecial extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Create Special</h1>
				</div>
			</div>
		);
	}
}
