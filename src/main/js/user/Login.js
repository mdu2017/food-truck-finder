import React from 'react';
import { Link } from 'react-router-dom';
import * as Forms from 'js/Forms';
import * as NavBars from 'js/navBars';

export class Login extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="row">
					<div className="col-6 offset-md-3">
						<h2>Login</h2>
						<hr />
						<Forms.LoginForm />
						<Link to="/register">Create Account</Link>
						<br />
						<Link to="/forgot-password">Forgot Password?</Link>
					</div>
				</div>
			</div>
		);
	}
}
