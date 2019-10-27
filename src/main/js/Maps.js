import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import React, { Component } from 'react';
import LogoMarker from 'js/images/food_truck_marker.png';

let cLat;
let cLng;

const style = {
    width: '50%',
    height: '50%'
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

    cLat = lat;
    cLng = lng;

    console.log(cLat + ' | ' + cLng);
}

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);


        //State for info window/markers/selectedPlace
        this.state = {

            //Center
            centerLat: 31.559814,
            centerLng: -97.141800,

            //Marker and info window
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},

            //TODO: need to add info window to each marker
            locations: []
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

        //Add marker when clicked
        this.setState(prevState => ({
            locations: [...prevState.locations, location]
        }));
        // map.panTo(location);
    };

    //Opens info window when marker clicked
    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });


    render(){
        return(
            <div>
                <Map google={this.props.google}
                     style={style}
                     zoom={10}
                     initialCenter={{lat: this.state.centerLat, lng: this.state.centerLng}}
                     onClick={this.onMapClicked}
                     scrollwheel={true}
                >

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <h3>{this.state.selectedPlace.name}</h3>
                </InfoWindow>

                {/*Info marker working*/}
                <Marker onClick={this.onMarkerClick}
                        name={'Current location'} />


                {/* Add marker on click */}
                {this.state.locations.map((location, index) => {
                    return(
                        <Marker onClick={this.onMarkerClick} icon={LogoMarker}
                            key={index}
                            position={{lat: location.lat(), lng: location.lng()}}
                            name={'Your Food Truck'}
                        />
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
