import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';
import React from 'react';
import LogoMarker from 'js/images/food_truck_marker.png';
import ViewMarker from 'js/images/food_truck_existing.png';

// Currently in dashboard and Create food truck page

const style = {
	width: '65%',
	height: '65%'
};

export class MapContainer extends React.Component {
	constructor(props) {
		super(props);

		//State for info window/markers/selectedPlace
		this.state = {
			//Center
			centerLat: 31.549701,
			centerLng: -97.114305,

			//Marker and info window
			showingInfoWindow: false,
			activeMarker: {},
			selectedPlace: {},

			//Food truck locations (markers)
			locations: [],

			//One click for location
			alreadyClicked: false,

			//Food truck location when clicked
			ftLat: null,
			ftLng: null,

			loc: { lat: 31.538813002764755, lng: -97.14596871840052 },

			// TODO: Sample locations to test view nearby food truck (stores object object)
			markers: [
				{ lat: 31.538813002764755, lng: -97.14596871840052 },
				{ lat: 31.532965359436357, lng: -97.11 },
				{ lat: 31.532965359436357, lng: -97.12021951185756 },
				{ lat: 31.580066500056425, lng: -97.15 },
				{ lat: 31.5724617149029, lng: -97.06357125746302 }
			]
		};

		//Set user location
		this.getLocation();

		//binds status of click on map
		this.onMapClicked = this.onMapClicked.bind(this);
	}

	// Passes the selected Location back to caller
	handleSelection(lat, long) {
		this.props.handleMapSelection(lat, long);
	}

	// Sample function to display nearby food trucks
	displayMarkers = () => {
		return this.state.markers.map((marker, index) => {
			return (
				<Marker
					onClick={this.onMarkerClick}
					key={index}
					icon={ViewMarker}
					position={{
						lat: marker.lat,
						lng: marker.lng
					}}
					name={'Food truck ' + index}
				/>
			);
		});
	};

	// Gets and sets users current location
	getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.setUserCoord);
		} else {
			console.log('Geolocation is not supported by this browser.');
		}
	}

	//Sets user coordinates (WORKS)
	setUserCoord = position => {
		let lat = parseFloat(position.coords.latitude);
		let lng = parseFloat(position.coords.longitude);
		console.log('Current location: ' + lat + ' | ' + lng);

		this.setState({
			centerLat: lat,
			centerLng: lng
		});

		{
			console.log(
				'user lat: ' +
					this.state.centerLat +
					' | user lng: ' +
					this.state.centerLng
			);
		}
	};

	//Map click logic
	onMapClicked = (props, map, coord) => {
		const { latLng } = coord;
		const lat = latLng.lat();
		const lng = latLng.lng();
		const location = coord.latLng;

		//Click location works
		// {console.log(lat + ' | ' + lng);}
		this.handleSelection(lat, lng);

		//If map clicked, dont show info window
		if (this.state.showingInfoWindow) {
			this.setState({
				showingInfoWindow: false,
				activeMarker: null
			});
		}

		//Add marker unless location has already been added
		if (!this.alreadyClicked) {
			//Set marker location, click status, food truck coordinates
			this.setState(prevState => ({
				locations: [...prevState.locations, location],
				ftLat: lat,
				ftLng: lng
			}));
		} else {
			console.log('You have already added a location');
		}

		// Update click status
		this.alreadyClicked = true;
	};

	//Opens info window when marker clicked
	onMarkerClick = (props, marker, e) => {
		this.setState({
			selectedPlace: props,
			activeMarker: marker,
			showingInfoWindow: true
		});
	};

	// TODO: Set location when marker is dragged (modify for multiple markers??)
	onMarkerDragend = (e, index, coord) => {
		let { latLng } = coord;
		let lat = latLng.lat();
		let lng = latLng.lng();
		const location = coord.latLng;

		console.log('New location: ' + lat + ' | ' + lng);
		this.handleSelection(lat, lng);

		// TODO: (Update new location of marker -- only works for 1 FT)
		this.setState(prevState => ({
			// -1 resets array
			locations: [...(prevState.locations - 1), location],
			ftLat: lat,
			ftLng: lng
		}));
	};

	render() {
		return (
			<div>
				<Map
					google={this.props.google}
					style={style}
					zoom={12}
					initialCenter={{
						lat: this.state.centerLat,
						lng: this.state.centerLng
					}}
					onClick={this.onMapClicked}
					scrollwheel={true}
					scaleControl={true}>
					{/*Info marker working*/}
					<Marker
						onClick={this.onMarkerClick}
						name={'Current location'}
					/>

					{/* Add marker on click */}
					{this.state.locations.map((location, index) => {
						return (
							<Marker
								onClick={this.onMarkerClick}
								icon={LogoMarker}
								key={index}
								position={{
									lat: location.lat(),
									lng: location.lng()
								}}
								name={'Your Food Truck!'}
								draggable={true}
								onDragend={(e, index, coord) =>
									this.onMarkerDragend(e, index, coord)
								}
							/>
						);
					})}

					{/* TODO: Display nearby food trucks*/}
					{this.displayMarkers()}

					{/*Generates info windows for all markers (must be put after displayMarkers*/}
					<InfoWindow
						id={'ftWindow'}
						marker={this.state.activeMarker}
						visible={this.state.showingInfoWindow}>
						<div>
							<h3>{this.state.selectedPlace.name}</h3>
							<a href={'#'}>Visit Info Page</a>
						</div>
					</InfoWindow>
				</Map>

				{/*Test truck lat (WORKS) */}
				{/*{console.log('truck lat: ' + this.state.ftLat + '\n' + 'truck lng: ' + this.state.ftLng)}*/}

				{/*Test user location (WORKS)*/}
				{/*{console.log('user lat: ' + this.state.centerLat + ' | user lng: ' + this.state.centerLng)}*/}
			</div>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'
})(MapContainer);
