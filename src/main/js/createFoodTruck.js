import axios from 'axios';

//Calls the food truck Endpoint to save it to the database
export function createFoodTruck(foodTruck){
    return axios.post('/api/food-truck/save', foodTruck);
}

// export function sentFTDetails(name, price, status){
//     return axios.post('/api/food-truck');
// }

//Grab FOOD TRUCK details
// export function getFoodTruckDetails() {
//     return axios.get('/api/food-truck');
// }

let Actions = {};

//Create food truck
Actions.createFT = foodTruck => {
    return dispatch => {
        return createFoodTruck(foodTruck).then(() => {
            return dispatch();
        });
    };
};

//Set food truck
// Actions.setFoodTruck = foodTruck => {
//     if(foodTruck){
//
//     }
//
//     return foodTruck;
// };

export { Actions };