import React from 'react';
import { Link } from 'react-router-dom';
import * as Forms from 'js/Forms';
import * as NavBars from 'js/navBars';

export class CreateAccount extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div>
					<div className="row">
						<div className="col-6 offset-md-3">
							<h2>Create Account</h2>
							<hr />
							<Forms.RegistrationForm />
							<Link to="/login">Already have an account?</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
