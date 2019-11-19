import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';
import React from 'react';
import LogoMarker from 'js/images/food_truck_marker.png';
import ViewMarker from 'js/images/food_truck_existing.png';
import * as Axios from 'js/axios';
import {Button, ListGroup, ListGroupItem} from 'reactstrap';
import {Link} from 'react-router-dom';

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

			// TODO: Sample locations to test view nearby food truck (stores object object)
			// markers: [{lat: 31.538813002764755, lng: -97.14596871840052},
			// 	{lat: 31.532965359436357, lng: -97.11},
			// 	{lat: 31.532965359436357, lng: -97.12021951185756},
			// 	{lat: 31.580066500056425, lng: -97.15},
			// 	{lat: 31.5724617149029, lng: -97.06357125746302}]

			// Locations of all nearby trucks
			nearbyTrucks: [],

			//Truck object DTOs
			trucks:[]
		};

		//binds status of click on map
		this.onMapClicked = this.onMapClicked.bind(this);
	}

	// View nearby trucks when loading map
    //TODO: WIP
	componentDidMount(){
        Axios.viewNearbyFT(this.state.centerLat, this.state.centerLng).then(result => {

            // For each coordinate, set lat and lng values
            result.forEach(tuple => {

            	//Food truck DTOs
            	this.state.trucks.push(tuple.third);

                // console.log('third is ');
                // console.log(tuple.third.name);
                // console.log(tuple.third.id);

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
    // TODO: if not caught, marker onClick doesnt close info window
    handleSelection(lat, long) {
	    try {
	        this.props.handleMapSelection(lat, long);
        }
        catch(error){
	        console.error('handleMapSelection Not Used');
        }
    }

	// Sample function to display nearby food trucks
	// displayMarkers = () => {
	// 	return this.state.nearbyTrucks.map((marker, index) => {
	// 		return (
	// 			<Marker
	// 				onClick={this.onMarkerClick}
	// 				key={`marker-${index}`}
	// 				icon={ViewMarker}
	// 				position={{
	// 					lat: marker.lat,
	// 					lng: marker.lng
	// 				}}
	// 				name={this.state.trucks[index].name}
	// 			>
	// 				<InfoWindow
	// 					id={'ftWindow'}
	// 					key={`infoWindow-${index}`}
	// 					marker={this.state.activeMarker}
	// 					visible={this.state.showingInfoWindow}>
	// 				</InfoWindow>
	// 			</Marker>
	// 		);
	// 	});
	// };


	// Sample function to display nearby food trucks
	// displayMarkers = () => {
	// 	return this.state.nearbyTrucks.map((marker, index) => {
	// 		return (
	// 			<Marker
	// 				onClick={this.onMarkerClick}
	// 				key={index}
	// 				icon={ViewMarker}
	// 				position={{
	// 					lat: marker.lat,
	// 					lng: marker.lng
	// 				}}
	// 				name={'Food truck ' + index}
	// 			/>
	// 		);
	// 	});
	// };

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
		// console.log('Current location: ' + lat + ' | ' + lng);

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

		// console.log('New location: ' + lat + ' | ' + lng);
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
								onClick={this.onMarkerClick}
								key={`marker-${index}`}
								icon={ViewMarker}
								position={{
									lat: marker.lat,
									lng: marker.lng
								}}
								name={this.state.trucks[index].name}>

								{/*<InfoWindow*/}
								{/*	id={'ftWindow'}*/}
								{/*	// key={`infoWindow-${index}`}*/}
								{/*	marker={this.state.activeMarker}*/}
								{/*	visible={this.state.showingInfoWindow}>*/}
								{/*</InfoWindow>*/}
							</Marker>

						);
					})}

					<InfoWindow
						marker={this.state.activeMarker}
						visible={this.state.showingInfoWindow}>
						<div>
							<h3>{this.state.selectedPlace.name}</h3>
							{/*<a href={'/food-truck-details/:index'}>Visit Info Page</a>*/}
						</div>
					</InfoWindow>

					{/*Display nearby food trucks*/}
					{/*{this.displayMarkers()}*/}

					{/*{this.displayInfoWindows()}*/}

					{/*Generates info windows for all markers (must be put after displayMarkers*/}
					{/*{this.state.nearbyTrucks.map((truck, index) => {*/}
					{/*	return(*/}
					{/*		<InfoWindow*/}
					{/*			id={'ftWindow'}*/}
					{/*			marker={this.state.activeMarker}*/}
					{/*			key={index}*/}
					{/*			visible={this.state.showingInfoWindow}>*/}
					{/*			<div>*/}
					{/*				<h3>{this.state.selectedPlace.name}</h3>*/}
					{/*				<h6>{this.state.trucks[index].name}</h6>*/}
					{/*				/!*<a href={'/food-truck-details/:index'}>Visit Info Page</a>*!/*/}
					{/*			</div>*/}
					{/*		</InfoWindow>*/}
					{/*	);*/}
					{/*})}*/}
				</Map>

			{/* {console.log(this.state.nearbyTrucks)}*/}
				{console.log(this.state.trucks)}

			{/*{this.displayMarkers()}*/}

			{/*{this.getNearbyTrucks()}*/}
			{/*{console.log(this.state.viewNearbyTrucks)}*/}

			{/*Test truck lat (WORKS) */}
			{/*{console.log('truck lat: ' + this.state.ftLat + '\n' + 'truck lng: ' + this.state.ftLng)}*/}

			{/*Test user location (doesnt work before map loads)*/}
			{/*{console.log('user lat: ' + this.state.centerLat + ' | user lng: ' + this.state.centerLng)}*/}
			</div>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'
})(MapContainer);
