import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import React, { Component } from 'react';
import LogoMarker from 'js/images/food_truck_marker.png';

const style = {
    width: '50%',
    height: '50%',
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
            ftLng: null
        };


        //Set user location
        this.getLocation();

        //binds status of click on map
        this.onMapClicked = this.onMapClicked.bind(this);
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setUserCoord);
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    //Sets user coordinates (WORKS)
    setUserCoord = (position) => {
        let lat = parseFloat(position.coords.latitude);
        let lng = parseFloat(position.coords.longitude);
        console.log(lat + ' | ' + lng);

        this.setState({
            centerLat: lat,
            centerLng: lng
        });

        {console.log('user lat: ' + this.state.centerLat + ' | user lng: ' + this.state.centerLng);}
    };

    //Map click logic
    onMapClicked = (props, map, coord) => {

        const {latLng} = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const location = coord.latLng;

        //Click location works
        // {console.log(lat + ' | ' + lng);}

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
                        <Marker onClick={this.onMarkerClick} icon={LogoMarker}
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

                {/*Test truck lat (WORKS) */}
                {/*{console.log('truck lat: ' + this.state.ftLat + '\n' + 'truck lng: ' + this.state.ftLng)}*/}

                {/*Test user location*/}
                {/*{console.log('user lat: ' + this.state.centerLat + ' | user lng: ' + this.state.centerLng)}*/}
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'
})(MapContainer);
