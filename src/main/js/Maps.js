// import React, { Component } from 'react';
// import GoogleMapReact from 'google-map-react';
// import { Icon } from 'semantic-ui-react';
//
// // const google = window.google;
//
// const Marker = (props) => {
//     return(
//         <div>
//             <Icon className="question circle"
//                   size='big'
//                   style={pinStyle}
//                   onClick={props.onClick}
//             />
//         </div>
//     );
// };
//
// //Add listener
// // google.maps.event.addListener(Marker, "click", function (event) {
// //     let latitude = event.latLng.lat();
// //     let longitude = event.latLng.lng();
// //     console.log( latitude + ', ' + longitude );
// //
// //     let radius = new google.maps.Circle({map: map,
// //         radius: 100,
// //         center: event.latLng,
// //         fillColor: '#777',
// //         fillOpacity: 0.1,
// //         strokeColor: '#aa2c4e',
// //         strokeOpacity: 0.8,
// //         strokeWeight: 2,
// //         draggable: true,    // Dragable
// //         editable: true      // Resizable
// //     });
// //
// //     // Center of map
// //     map.panTo(new google.maps.LatLng(latitude,longitude));
// //
// // }); //end addListener
//
// const pinStyle={
//     borderRadius: '10px',
//     transform: 'matrix(-1, 0, 0, 1, 10, 0)'
// };
//
//
// class SimpleMap extends React.Component {
//     static defaultProps = {
//         center: {
//             lat: 31.559814,
//             lng: -97.141800
//         },
//
//         //Higher number -> more zoom
//         zoom: 10
//     };
//
//     render() {
//         console.log('Lat: ' + this.props.center.lat +
//             ' | " + "Lng: ' + this.props.center.lng);
//         return (
//             // Important! Always set the container height explicitly
//             <div style={{height: '50%', width: '50%'}}>
//                 <GoogleMapReact
//                     bootstrapURLKeys={{
//                         key: 'AIzaSyBOAgaJ1xytT1pdAuP1c8xcTr9vq6ge7e4'}}
//                     defaultCenter={this.props.center}
//                     defaultZoom={this.props.zoom}
//                     onChildMouseEnter={this.onChildMouseEnter}
//                     onChildMouseLeave={this.onChildMouseLeave}
//
//
//                 >
//                     <Marker lat={this.props.center.lat} lng={this.props.center.lng} text={'You'} />
//                 </GoogleMapReact>
//             </div>
//         );
//     }
// }
//
// export default SimpleMap;