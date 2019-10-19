import React from 'react';
import * as NavBars from 'js/navBars';

export class SearchUsers extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Search Users</h1>
				</div>
			</div>
		);
	}
}
