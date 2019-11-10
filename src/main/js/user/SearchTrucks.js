import React from 'react';
import { connect } from 'react-redux';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
    Col,
    Row
} from 'reactstrap';
import MapContainer from 'js/Maps';

export class SearchFoodTrucks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
        };
    }

    setName = name => this.setState({ name });

    handleSubmit = event => {
        this.props.searchFoodTrucks({
            name: this.state.name,
        });
        event.preventDefault();
    };

    render() {
        return (
            <div>
                <NavBars.CustomNavBar />
                <div className="container padded">
                    <h1>Create a Food Truck</h1>
                    <br />
                    <Form>
                        <FormGroup>
                            <Label for="ftName">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="ftName"
                                placeholder="Name of Food Truck"
                                onChange={e => this.setName(e.target.value)}
                            />
                        </FormGroup>
                    </Form>

                    <Button onClick={this.handleSubmit}>Submit</Button>
                </div>
            </div>
        );
    }
}
CreateFoodTruck = connect(
    () => ({}),
    dispatch => ({
        searchFoodTrucks: foodTruck =>
            dispatch(Axios.Actions.createFT(foodTruck))
            // Success
                .then(function(result) {
                    window.alert('Creation of the Food Truck was successful!');
                })
                // Failed
                .catch(error =>
                    window.alert('Creation of the Food Truck failed!')
                )
    })
)(CreateFoodTruck);



{/*<h1>Search Trucks Page</h1>*/}

{/*/!*TODO: Fix call (not working from front end)*!/*/}
{/*<FormGroup>*/}
{/*    <Label for="exampleSearch">Search for Food Trucks</Label>*/}
{/*    <Input type='text' name='search'*/}
{/*           placeholder="spicy spicy"*/}
{/*           onChange={e => this.setName(e.target.value)}/>*/}
{/*    <button type="button" className="btn btn-info"*/}
{/*            onClick={this.handleSubmit}>Search</button>*/}
{/*</FormGroup>*/}