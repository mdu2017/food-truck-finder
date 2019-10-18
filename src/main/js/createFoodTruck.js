import axios from 'axios';

//Calls the food truck Endpoint to save it to the database
export function createFoodTruck(foodTruck){
    return axios.post('/api/food-truck/save', foodTruck);
}

//Grab FOOD TRUCK details
export function getFoodTruckDetails() {
    return axios.get('/api/food-truck');
}

let Actions = {};

//Create food truck
Actions.createFT = foodTruck => {
    return dispatch => {
        return createFoodTruck(foodTruck).then(() => {
            return dispatch();
        });
    };
};

export { Actions };

//Set food truck
// Actions.setFoodTruck = foodTruck => {
// 	return{type: Actions.Types.SET_FOOD_TRUCK, foodTruck};
// };