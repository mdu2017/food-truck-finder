import React from 'react';
import * as NavBars from "js/navBars";

export class EventDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: null
        }
    }

    render() {
        return (
            <div>
                <NavBars.CustomNavBar />
                <div className="container padded">
                    <h1>Event Name</h1>
                    <h3>Attending Food Trucks</h3>
                    <h3>Date</h3>
                    <h3>Time</h3>
                    <h3>Location</h3>
                </div>
            </div>
        );
    }
}
