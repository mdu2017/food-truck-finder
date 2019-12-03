package foodtruckfinder.site.endpoint;

import alloy.util.Tuple;
import foodtruckfinder.site.common.External.Rating;
import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import foodtruckfinder.site.common.foodtruck.FoodTruckService;
import foodtruckfinder.site.common.user.UserDto;
import foodtruckfinder.site.common.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/unsecure")
public class ExampleEndpoint {

    @Autowired
    private UserService unsecureUserService;

    @Autowired
    private FoodTruckService unsecureFoodTruckService;

    @GetMapping(value = "/user/{username}", produces = "application/json")
    public Optional<UserDto> viewUser(@PathVariable("username") String username) {
        return unsecureUserService.findUserByUsername(username);
    }

    @GetMapping(value = "/user/searchUsers", produces = "application/json")
    public Optional<List<UserDto>> searchUsers(String username) {
        return unsecureUserService.searchUsers(username);
    }

    @GetMapping(value = "/user/id/{id}", produces = "application/json")
    public Optional<UserDto> viewUserByID(@PathVariable("id") Long user_ID) {
        return unsecureUserService.findUserByID(user_ID);
    }

    @GetMapping(value = "/recommendations", produces = "application/json")
    public Optional<List<FoodTruckDto>> getRecommendations(double userlat,
                                                           double userlong,
                                                           double radius) {
        return unsecureFoodTruckService.getRecommendations(userlat, userlong, radius);
    }

    @GetMapping(value = "/nearby", produces = "application/json")
    public Optional<List<FoodTruckDto>> getNearby(double userlat,
                                                           double userlong,
                                                           double radius) {
        return unsecureFoodTruckService.getNearby(userlat, userlong, radius);
    }

    /**
     * Search for a food truck by name
     * @param name The food truck name
     * @return the list of food trucks
     *
     */
    @GetMapping(value = "/searchFoodTrucks", produces = "application/json")
    public Optional<List<FoodTruckDto>> searchFoodTrucks(String name) {
        return unsecureFoodTruckService.searchFoodTrucks(name);
    }

    /** Search food truck by type */
    @GetMapping(value = "/searchFoodTrucksByType", produces = "application/json")
    public Optional<List<FoodTruckDto>> searchFoodTrucksByType(String type) {
        return unsecureFoodTruckService.searchFoodTrucksByType(type);
    }

    @GetMapping(value = "/searchTrucksByPrice", produces = "application/json")
    public Optional<List<FoodTruckDto>> searchTrucksByPrice(double maxPrice) {
        return unsecureFoodTruckService.searchTrucksByPrice(maxPrice);
    }

    //TODO: search by max distance
    @GetMapping(value = "/searchTrucksByDistance", produces = "application/json")
    public Optional<List<FoodTruckDto>> searchTrucksByDistance(double userLat, double userLng, double maxDistance) {
        return unsecureFoodTruckService.searchTrucksByDistance(userLat, userLng, maxDistance);
    }

    // Take an id, and look up the corresponding foodtruck
    @GetMapping(value = "/food-truck/{id}", produces = "application/json")
    public Optional<FoodTruckDto> getFoodTruck(@PathVariable("id") String id) {
        return unsecureFoodTruckService.find(id);
    }

    @GetMapping(value = "/getRatingByTruck", produces = "application/json")
    public List<Rating> getRatingByTruck(Long truck_ID){
        return unsecureFoodTruckService.getRatingByTruck(truck_ID);
    }

    @GetMapping(value = "/viewNearbyTrucks", produces = "application/json")
    public Optional<List<Tuple.Triple<Double, Double, FoodTruckDto>>> viewNearbyTrucks(double userlat, double userlong){
        return unsecureFoodTruckService.viewNearbyTrucks(userlat, userlong);
    }
}
