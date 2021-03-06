import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import * as Axios from 'js/axios';
import * as NavBars from 'js/navBars';
import {Form, FormGroup, Input, ListGroup, ListGroupItem} from 'reactstrap';
import Spinner from 'js/images/spinner.gif';

export class SearchUsers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchUser: null,
			searchResults: [],
			loadingSearch: false,
			spinnerHeight: 60,
			spinnerWidth: 60
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	setSearchUser = searchUser => this.setState({ searchUser });

	handleSubmit = event => {
		this.setState({ loadingSearch: true });

		setTimeout(
			function () {
				this.setState({loadingSearch: true}, () => {
					Axios.searchUsers(this.state.searchUser).then(result => {
						this.setState({
							loadingSearch: false,
							searchResults: result
						});
					});
				});
			}.bind(this),
			250
		);
		event.preventDefault();
	};

	//TODO: Get reviews/ratings and user's list of subscribed food trucks
	renderSearchResults() {
		return (
			<div>
				{this.state.loadingSearch ? (
					<img src={Spinner} width={this.state.spinnerWidth} height={this.state.spinnerHeight} mode="fit" />
				) : (
					<div>
						<br />
						{this.state.searchResults &&
						this.state.searchResults.length > 0 ? (
							<div>
								{this.state.searchResults.map(
									(user, index) => (
										<ListGroup key={index}>
											<ListGroupItem>
												<Link
													to={`/user/${user.username}`}
												>
													<h6>Username: {user.username}</h6>
												</Link>
											</ListGroupItem>
										</ListGroup>
									)
								)}
							</div>
						) : this.state.searchUser ? (
							<div>
								<h6>No users found.</h6>
							</div>
						) : null}
					</div>
				)}
			</div>
		);
	}

	render() {
		return (
			<div>
				<NavBars.CustomNavBar />
				<div className="container padded">
					<h1>Search Users</h1>
					<br />
					<Form onChange={this.handleSubmit}>
						<FormGroup>
							<Input
								type="text"
								name="searchUsers"
								id="searchUsers"
								placeholder="Search Users"
								onChange={e =>
									this.setSearchUser(e.target.value)
								}
							/>
						</FormGroup>
					</Form>
					{this.renderSearchResults()}
				</div>
			</div>
		);
	}
}
SearchUsers = connect(
	() => ({}),
	dispatch => ({
		searchUsers: searchUsers =>
			dispatch(Axios.Actions.searchUsers(searchUsers))
	})
)(SearchUsers);