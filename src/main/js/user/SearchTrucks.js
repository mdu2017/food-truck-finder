import React from 'react';
import * as NavBars from 'js/navBars';
import {Button, Form, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import * as Axios from 'js/axios';

export class SearchTrucks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: null
		};
	}

	setName = name => this.setState({ name });

	//Sumbit handler
	handleSubmit = event => {
		this.props.searchTruck({
			name: this.state.name,
		});
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Search Trucks Page</h1>

					{/*TODO: Fix call (not working from front end)*/}
					<FormGroup>
						<Label for="exampleSearch">Search for Food Trucks</Label>
						<Input type='text' name='search'
							   placeholder="spicy spicy"
							   onChange={e => this.setName(e.target.value)}/>
						<button type="button" className="btn btn-info"
								onClick={this.handleSubmit}>Search</button>
					</FormGroup>

				</div>
			</div>
		);
	}
}

SearchTrucks = connect(
	() => ({}),
	dispatch => ({
		searchTruck: name => dispatch(Axios.Actions.searchFoodTruck(name))
	})
)(SearchTrucks);
