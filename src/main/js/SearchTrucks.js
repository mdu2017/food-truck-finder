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
        console.log('Name in handleSubmit: ' + this.state.name);
        event.preventDefault();
    };

    render() {
        return (
            <div>
                <NavBars.CustomNavBar />
                <div className="container padded">
                    <h1>Search for Food Truck</h1>
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

                    <Button type="button" className="btn btn-info" onClick={this.handleSubmit}>Submit</Button>
                </div>
            </div>
        );
    }
}

SearchFoodTrucks = connect(
    () => ({}),
    dispatch => ({
        searchFoodTrucks: name =>
            dispatch(Axios.Actions.searchFoodTrucks(name))
    })
)(SearchFoodTrucks);
