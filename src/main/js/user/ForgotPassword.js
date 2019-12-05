import React from 'react';
import {Link} from 'react-router-dom';
import * as NavBars from 'js/navBars';

export class ForgotPassword extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="row">
					<div className="col-6 offset-md-3">
						<h2>Forgot Password?</h2>
						<hr />
						<Forms.ForgotPasswordForm />
						<Link to="/register">Need an Account?</Link>
					</div>
				</div>
			</div>
		);
	}
}
