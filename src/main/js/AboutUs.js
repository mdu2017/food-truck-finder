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

					<p>Welcome to Food Truck Finder, your number one source for all things food truck. <br/>
						We're dedicated to providing you the very best app for finding your favorite places to go, <br/>
						with an emphasis on user experience and great results.<br/>

						Founded in 2019 by The Free Tank Tops, Food Truck Finder has come a long way from <br/>
						its beginnings in the small village of Waco, Texas. When we first started out, <br/>
						our passion for the Food Truck Experience drove us to start our own business.<br/>

						We hope you enjoy our product as much as we enjoy offering it to you. <br/>
						If you have any questions or comments, please don't hesitate to contact us.<br/>

						Sincerely,<br/>

						Your Favorite Food Truck App</p>

					<Media left href={AboutUsPhoto}>
						<Media
							object
							src={AboutUsPhoto}
							width={300}
							height={300}
						/>
					</Media>

				</div>
			</div>
		);
	}
}
