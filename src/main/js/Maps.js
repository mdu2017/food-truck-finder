// import {GoogleApiWrapper, Map, Marker, InfoWindow, HeatMap} from 'google-maps-react';
// import React, { Component } from 'react';
//
// const style = {
//     width: '50%',
//     height: '50%'
// };
//
// const MyMap = compose(
//     withStateHandlers(() => ({
//         isMarkerShown: false,
//         markerPosition: null
//     }), {
//         onMapClick: ({ isMarkerShown }) => (e) => ({
//             markerPosition: e.latLng,
//             isMarkerShown:true
//         })
//     }),
//     withScriptjs,
//     withGoogleMap
// )
// (props =>
//     <GoogleMap
//         defaultZoom={8}
//         defaultCenter={{ lat: -34.397, lng: 150.644 }}
//         onClick={props.onMapClick}
//     >
//         {props.isMarkerShown && <Marker position={props.markerPosition} />}
//
//     </GoogleMap>
// );
//
// export default class MapContainer extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return (
//             <div style={style}>Test</div>
//         );
//     }
// }
//