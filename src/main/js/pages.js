import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

export class Home extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is the home page.

				<ul>
					<li><Link to="/page-1">Page 1</Link></li>
					<li><Link to="/page-2">Page 2</Link></li>
					<li><Link to="/page-3">Page 3</Link></li>
				</ul>
			</div>
		);
	}
}

export class Page1 extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is page 1.

				<button onClick={() => axios.post('/api/login', {username: 'admin', password: 'admin'})}>Login</button>
				<button onClick={() => axios.get('/api/owner/1')}>Click</button>
			</div>
		);
	}
}

export class Page2 extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is page 2.
			</div>
		);
	}
}

export class Page3 extends React.Component {
	render() {
		return (
			<div className="container padded">
				This is page 3.
			</div>
		);
	}
}