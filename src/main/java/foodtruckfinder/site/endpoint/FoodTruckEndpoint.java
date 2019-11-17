package foodtruckfinder.site.endpoint;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import alloy.util.Json;
import foodtruckfinder.site.common.External.Rating;
import foodtruckfinder.site.common.foodtruck.Stop;
import foodtruckfinder.site.common.user.UserDto;
import foodtruckfinder.site.common.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import alloy.util.Tuple;

import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import foodtruckfinder.site.common.foodtruck.FoodTruckService;

/**
 * If this is your first time looking through this project, see the more in-depth overview of controllers in UserEndpoint.
 */
@RestController
@RequestMapping("/api/food-truck")
public class FoodTruckEndpoint {
	// FoodTruckService contains our business logic for dealing with food trucks as well as saving/reading them
	@Autowired
	private FoodTruckService foodTruckService;

	// Take an id, and look up the corresponding foodtruck
//	@GetMapping(value = "/{id}", produces = "application/json")
//	public Optional<FoodTruckDto> getFoodTruck(@PathVariable("id") String id) {
//		return foodTruckService.find(id);
//	}

	// Take a JSON representation of a food truck and save it to the database
	@PostMapping(value = "/save", produces = "application/json")
	public FoodTruckDto saveFoodTruck(@RequestBody FoodTruckDto foodTruckDto) throws SQLException {
		foodTruckService.save(foodTruckDto);
		return foodTruckDto;
	}

    @PostMapping(value = "/removeTruck", produces = "application/json")
	public boolean removeTruck(Long truck_id){
		return foodTruckService.remove(truck_id);
	}

	@GetMapping(value = "/getSubscribers/{id}", produces = "application/json")
	public List<String> getSubscribers(@PathVariable("id") Long id) { return foodTruckService.getSubscribers(id); }




	@PostMapping(value = "/subscribe", produces = "application/json")
	public void subscribe(Long ftid, Long userid) {
		foodTruckService.subscribe(ftid, userid);
	}

	/**
	 * This function returns a list of food trucks based on an owner id
	 *
	 * @param owner_id the owner to retrieve food trucks for
	 * @return A list of food trucks
	 */
	@GetMapping(value = "/getFoodTrucksByOwner", produces = "application/json")
	public Optional<List<FoodTruckDto>> getFoodTrucksByOwner(Long owner_id) {
		return foodTruckService.getFoodTrucksByOwner(owner_id);
	}

	/**
	 * This function gets a string list of food types
	 *
	 * @return the string list of food types
	 */
	@GetMapping(value = "/getFoodTypes", produces = "application/json")
	public List<String> getFoodTypes() {
		return Arrays.stream(FoodTruckDto.FoodType.values())
				.map(FoodTruckDto.FoodType::name)
				.collect(Collectors.toList());
	}


	/**
	 * This function gets a string list of the status
	 *
	 * @return the string list of the status
	 */
	@GetMapping(value = "/getStatusNames", produces = "application/json")
	public List<String> getStatusNames() {
		return Arrays.stream(FoodTruckDto.FTStatus.values())
				.map(FoodTruckDto.FTStatus::name)
				.collect(Collectors.toList());
	}

	/**
	 * Search for a food truck by name
	 * @param name The food truck name
	 * @return the list of food trucks
	 */
	@GetMapping(value = "/searchFoodTrucks", produces = "application/json")
	public Optional<List<FoodTruckDto>> searchFoodTrucks(String name) {
		return foodTruckService.searchFoodTrucks(name);
	}

	@PostMapping(value = "/send-notification", produces = "application/json" )
	public void sendNotification(String message, Long foodTruckId){
		foodTruckService.sendNotification(message, foodTruckId);
	}

	@PostMapping(value = "/addDeal", produces = "application/json")
	public void addDeal(String message, Long truckID, LocalDateTime start, LocalDateTime end){
		foodTruckService.sendNotification(message, truckID);
		foodTruckService.addDeal(message, truckID, start, end);
	}

	@PostMapping(value = "/removeDeal", produces = "application/json")
	public void removeDeal(Long truckID) {
        foodTruckService.removeDeal(truckID);
    }

	@GetMapping(value = "/getCurrentLocation", produces = "application/json")
	public Optional<Tuple.Pair<Double, Double>> getCurrentLocation(Long foodTruckId){
		return foodTruckService.getCurrentLocation(foodTruckId);
	}
}
