import React from 'react';
import * as Axios from 'js/axios';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	Input,
	Button
} from 'reactstrap';

export default class FoodTypesModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toggleModal: false,
			selectedFoodTypes: [],
			foodtypes: []
		};
		this.toggle = this.toggle.bind(this);
		this.handleModalSubmit = this.handleModalSubmit.bind(this);
		this.getFoodTypes();
	}

	getFoodTypes() {
		Axios.getFoodTypes().then(result => {
			this.setState({ foodtypes: result });
		});
	}

	toggle() {
		this.setState({
			toggleModal: !this.state.toggleModal
			// foodTruckId: id
		});
	}

	handleModalSubmit = event => {
		this.toggle();
		event.preventDefault();
	};

	render() {
		return (
			<div>
				{console.log('hi')}
				<Modal isOpen={this.state.toggleModal}>
					<Form onSubmit={this.handleModalSubmit}>
						<ModalHeader>Select Food Types</ModalHeader>
						<ModalBody>
							<Input
								type="textarea"
								name="text"
								id="exampleText"
								placeholder="Limited to 300 characters."
							// onChange={e => this.setMessage(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<input
								type="submit"
								value="Submit"
								color="primary"
							/>
							<Button
								color="danger"
								onClick={() => this.toggle(null)}
							>
								Cancel
							</Button>
						</ModalFooter>
					</Form>
				</Modal>
			</div>
		);
	}
}
