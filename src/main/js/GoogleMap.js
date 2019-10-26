import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import React, { Component } from 'react';

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
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},

            // markers: [
            //     {
            //         title: 'The marker`s title will appear as a tooltip.',
            //         name: 'SOMA',
            //         position: { lat: 31.559814, lng: -97.141800 }
            //     }
            // ]
        };

        //binds status of click on map
        this.onMapClicked = this.onMapClicked.bind(this);
    }



    //Map is the google map instance
    //coord is storing the latitutde and longitude
    onMapClicked = (props, map, coord) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }

        const {latLng} = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        //Click location works
        {console.log(lat + ' | ' + lng);}
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

            <Marker onClick={this.onMarkerClick}
                name={'Your are here'}
                position={{lat: 31.559814, lng: -97.141800}}
            />

            <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}>
                <div>
                    <h3>{this.state.selectedPlace.name}</h3>
                </div>
            </InfoWindow>

            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'
})(MapContainer);