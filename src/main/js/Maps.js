import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import React from 'react';
import LogoMarker from 'js/images/food_truck_marker.png';
import * as Axios from 'js/axios';

// Currently in dashboard and Create food truck page
const style = {
	width: '65%',
	height: '65%',
};

export class MapContainer extends React.Component {
	constructor(props) {
		super(props);

        //TODO: set current location before map loads
		this.getLocation();

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

			// Locations of all nearby trucks
			nearbyTrucks: [],

			//Truck object DTOs
			trucks:[]
		};

		//binds status of click on map
		this.onMapClicked = this.onMapClicked.bind(this);
	}

	// View nearby trucks when loading map
	componentDidMount(){
		Axios.viewNearbyFT(this.state.centerLat, this.state.centerLng).then(result => {

            // For each coordinate, set lat and lng values
			result.forEach(tuple => {

            	//Food truck DTOs
            	this.state.trucks.push(tuple.third);

                //Location pair values (because tuple object doesnt work)
				let loc = {lat: tuple.first, lng: tuple.second};
				this.setState(state => {
					const nearbyTrucks = state.nearbyTrucks.concat(loc);
					return {
						nearbyTrucks,
						value: loc
					};
				});
			});
		});
	}

	// Passes the selected Location back to caller
    // TODO: if not caught, clicking map doesn't close info window
    // TODO: Bug - infowindow opening 3 times
	handleSelection(lat, long) {
	    try {
	        this.props.handleMapSelection(lat, long);
	    }
	    catch(error){
	        console.error('handleMapSelection Not Used');
	    }
	}

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

		this.setState({
			centerLat: lat,
			centerLng: lng
		});
	};

	//Map click logic
	onMapClicked = (props, map, coord) => {
		const { latLng } = coord;
		const lat = latLng.lat();
		const lng = latLng.lng();
		const location = coord.latLng;

		//Click location works
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

	// Set location for food truck when dragged
	onMarkerDragend = (e, index, coord) => {
		let { latLng } = coord;
		let lat = latLng.lat();
		let lng = latLng.lng();
		const location = coord.latLng;

		this.handleSelection(lat, lng);

		// Update new location of marker -- only for 1 FT
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
					zoom={14}
					initialCenter={{lat: this.state.centerLat, lng: this.state.centerLng}}
					onClick={this.onMapClicked}
					scrollwheel={true}
					scaleControl={true}>

                    {/*Current location marker*/}
                    <Marker onClick={this.onMarkerClick} name={'Current Location'}/>

					{/* Marker that is added on click (separate from nearby markers) */}
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

					{/*Display all nearby markers*/}
					{this.state.nearbyTrucks.map((marker, index) => {
						return (
							<Marker
								id={index}
								onClick={this.onMarkerClick}
								key={`marker-${index}`}
								icon={LogoMarker}
								description={this.state.trucks[index].description}
								position={{
									lat: marker.lat,
									lng: marker.lng
								}}
								name={this.state.trucks[index].name}>
							</Marker>

						);
					})}

					{/* Set infoWindows for each marker */}
					{this.state.trucks.map((marker, index) => {
						return (
							<InfoWindow
								marker={this.state.activeMarker}
								visible={this.state.showingInfoWindow}>
								<h3>{this.state.selectedPlace.name}</h3>
								<h6>{this.state.selectedPlace.description}</h6>
								<a href={`#/food-truck-details/${this.state.selectedPlace.id+1}`}>View Details Page</a>
							</InfoWindow>
						);
					})}

				</Map>
			</div>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'
})(MapContainer);
