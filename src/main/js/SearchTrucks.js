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
    Row, ListGroup, ListGroupItem
} from 'reactstrap';
import {Link} from 'react-router-dom';

export class SearchFoodTrucks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            // user_id: JSON.parse(Axios.getCookie('user')).id,
            trucks: []
        };
    }

    setName = name => this.setState({ name });

    //Submit handler
    handleSubmit = event => {
        this.props.searchFoodTrucks({
            name: this.state.name,
        });
        console.log('Name in handleSubmit: ' + this.state.name);
        event.preventDefault();
    };

    // Get list of food trucks by name after search call
    // componentWillMount() {
    //     Axios.searchFoodTrucks(this.state.name).then(result => {
    //         {console.log(result);}
    //         this.setState({ trucks: result });
    //     });
    // }
    // Display list of food trucks after search
    // renderFoodTrucks() {
    //     return (
    //         <div>
    //             {this.state.trucks.length > 0 ? (
    //                 <div>
    //                     {this.state.trucks.map((truck, index) => (
    //                         <ListGroup key={index}>
    //                             <ListGroupItem>
    //                                 <Link to={'/food-truck-details'}>
    //                                     {truck.name}
    //                                 </Link>
    //                             </ListGroupItem>
    //                         </ListGroup>
    //                     ))}
    //                 </div>
    //             ) : (
    //                 <div>
    //                     <br/>
    //                     <br/>
    //                     <h6>No searches yet.</h6>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // }

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

                    {/*Display list of food trucks by name search*/}
                    {/*{this.renderFoodTrucks()}*/}

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
