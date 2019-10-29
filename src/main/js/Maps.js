import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import React, { Component } from 'react';
import LogoMarker from 'js/images/food_truck_marker.png';
import * as FoodTruck from 'js/foodtruck/CreateFT';

let eLat, eLng;

const style = {
    width: '50%',
    height: '50%',
};

//Gets user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setUserCoord);
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

//Get user coordinates
function setUserCoord(position) {
    let lat = parseFloat(position.coords.latitude);
    let lng = parseFloat(position.coords.longitude);
    console.log('current lat: ' + lat + '\n' + 'current lng: ' + lng);
    eLat = lat;
    eLng = lng;
}

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);

        //State for info window/markers/selectedPlace
        this.state = {

            expectedCenter: getLocation(),
            expectedLat: eLat,
            expectedLng: eLng,

            //Center
            centerLat: 31.549701,
            centerLng: -97.114305,

            //Marker and info window
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},

            //TODO: need to add info window to each marker
            locations: [],

            //One click for location
            alreadyClicked: false,

            //Food truck location when clicked
            ftLat: 0.0,
            ftLng: 0.0
        };

        //binds status of click on map
        this.onMapClicked = this.onMapClicked.bind(this);
    }

    //Map click logic
    onMapClicked = (props, map, coord) => {

        const {latLng} = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const location = coord.latLng;

        //Click location works
        {console.log(lat + ' | ' + lng);}

        //If map clicked, dont show info window
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }

        //Add marker unless location has already been added
        if(!this.alreadyClicked) {
            //Set marker location, click status, food truck coordinates
            this.setState(prevState => ({
                locations: [...prevState.locations, location],
                ftLat: lat,
                ftLng: lng
            }));
        }
        else{
            console.log('You have already added a location');
        }

        // Update click status
        this.alreadyClicked = true;
    };

    //Opens info window when marker clicked
    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    // TODO: Set location when marker is dragged
    // onMarkerDragend = (coord, index) => {
    //     let {latLng} = coord;
    //     let lat = latLng.lat();
    //     let lng = latLng.lng();
    //
    //     this.setState(prevState => ({
    //         locations: [...this.state.locations];
    //         location[index] = {...locations[index], position: { lat, lng } };
    //     });
    //
    //
    // };

    render(){
        return(
            <div>
                <Map google={this.props.google}
                     style={style}
                     zoom={14}
                     initialCenter={{lat: this.state.centerLat, lng: this.state.centerLng}}
                     onClick={this.onMapClicked}
                     scrollwheel={true}
                >

                {/*Info marker working*/}
                <Marker onClick={this.onMarkerClick} name={'Current location'} />


                {/* Add marker on click */}
                {this.state.locations.map((location, index) => {
                    return(
                        <Marker onClick={this.onMarkerClick} icon={LogoMarker} /*draggable={true}*/
                            key={index}
                            position={{lat: location.lat(), lng: location.lng()}}
                            name={'Your Food Truck!'}
                        />
                        );
                })}
                    <InfoWindow id={'ftWindow'}
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <h3>{this.state.selectedPlace.name}</h3>
                            <a href={'#'}>Visit Info Page</a>
                        </div>

                    </InfoWindow>
                </Map>

                {/*Test truck lat*/}
                {/*{console.log('truck lat: ' + this.state.ftLat + '\n' + 'truck lng: ' + this.state.ftLng)}*/}

                {console.log('expected lat: ' + this.state.expectedLat + '\n' + 'expected lng: ' + this.state.expectedLng)}
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'
})(MapContainer);
