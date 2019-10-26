import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import React, { Component } from 'react';
import LogoMarker from 'js/images/food_truck_marker.png';
import { withGoogleMap, GoogleMap} from 'react-google-maps';


const google = window.google;

const style = {
    width: '50%',
    height: '50%'
};

export class MapContainer extends React.Component {
    constructor(props) {
        super(props);

        //Starting center coordinates
        this.centerLat = 31.559814;
        this.centerLng = -97.141800;

        //State for info window/markers/selectedPlace
        this.state = {
            // showingInfoWindow: false,
            // activeMarker: {},
            // selectedPlace: {},

        // {
        //     title: 'The marker`s title will appear as a tooltip.',
        //         name: 'SOMA',
        //     position: { lat: 31.559814, lng: -97.141800 }
        // }

            markers: [],
            locations: []
        };

        //binds status of click on map
        this.onMapClicked = this.onMapClicked.bind(this);
    }



    //Map is the google map instance
    //coord is storing the latitutde and longitude
    onMapClicked = (props, map, coord) => {

        const {latLng} = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        const location = coord.latLng;

        //Click location works
        {console.log(lat + ' | ' + lng);}

        // if (this.state.showingInfoWindow) {
        //     this.setState({
        //         showingInfoWindow: false,
        //         activeMarker: null
        //     });
        // }

        this.setState(prevState => ({
            locations: [...prevState.locations, location]
        }));
        // map.panTo(location);
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });


    render(){
        return(
            <Map google={this.props.google}
                 style={style}
                 zoom={10}
                 initialCenter={{lat: this.centerLat, lng: this.centerLng}}
                 onClick={this.onMapClicked}
                 scrollwheel={true}
            >


            {/*<Marker onClick={this.onMarkerClick}*/}
            {/*        name={'Your are here'}*/}
            {/*        position={{lat: 31.559814, lng: -97.141800}}*/}
            {/*/>*/}

            {/*<InfoWindow*/}
            {/*    marker={this.state.activeMarker}*/}
            {/*    visible={this.state.showingInfoWindow}>*/}
            {/*    <div>*/}
            {/*        <h3>{this.state.selectedPlace.name}</h3>*/}
            {/*    </div>*/}
            {/*</InfoWindow>*/}

            {this.state.locations.map((location, index) => {
                return(
                    <Marker icon={LogoMarker}
                        key={index}
                        position={{lat: location.lat(), lng: location.lng()}}
                    />
                );
            })}
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'
})(MapContainer);

// icon={{
//     url: LogoMarker,
//         anchor: new google.maps.Point(32,32),
//         scaledSize: new google.maps.Size(64,64)
// }}