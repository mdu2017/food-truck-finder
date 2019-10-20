import React from 'react';
import * as NavBars from 'js/navBars';

export class SearchTrucks extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Search Trucks Page</h1>
				</div>
			</div>
		);
	}
}
