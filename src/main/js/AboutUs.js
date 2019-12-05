import React from 'react';
import * as NavBars from 'js/navBars';
import AboutUsPhoto from 'js/images/about_us.png';
import {Media} from 'reactstrap';

export class AboutUs extends React.Component {
	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>About Us</h1>
					<br />
					<h4>Welcome to Food Truck Finder!</h4>
					<p>
						Your number one source for all things related to food
						trucks. We're dedicated to providing you the very best
						app for finding your favorite places to eat and
						socialize, with an emphasis on user experience and great
						results. Founded in 2019 by The Free Tank Tops, Food
						Truck Finder has come a long way from its beginnings in
						the small village of Waco, Texas. Upon starting out, our
						passion for the Food Truck Experience has driven us to
						start our own business. We hope you enjoy our app as
						much as we enjoy offering it to you. If you have any
						questions or comments, please don't hesitate to contact
						us.
					</p>
					<h4>
						Sincerely,
						<br />
						Your Favorite Food Truck App
					</h4>
					<br />
					<Media left href={AboutUsPhoto}>
						<Media object src={AboutUsPhoto} />
					</Media>
				</div>
			</div>
		);
	}
}
