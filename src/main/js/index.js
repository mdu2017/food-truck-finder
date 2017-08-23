import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import { Home, Page1, Page2, Page3 } from 'js/pages';

export default class Index extends React.Component {
	render() {
		return (
			<HashRouter>
				<div>
					<Route exact path="/" component={Home} />
					<Route exact path="/page-1" component={Page1} />
					<Route exact path="/page-2" component={Page2} />
					<Route exact path="/page-3" component={Page3} />
				</div>
			</HashRouter>
		);
	}
}