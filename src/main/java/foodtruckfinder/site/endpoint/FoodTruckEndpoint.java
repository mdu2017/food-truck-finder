package foodtruckfinder.site.endpoint;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
	@GetMapping(value = "/{id}", produces = "application/json")
	public Optional<FoodTruckDto> getFoodTruck(@PathVariable("id") String id) {
		return foodTruckService.find(id);
	}

	// Take a JSON representation of a food truck and save it to the database
	@PostMapping(value = "/save", produces = "application/json")
	public FoodTruckDto saveFoodTruck(@RequestBody FoodTruckDto foodTruckDto) {
		foodTruckService.save(foodTruckDto);
		return foodTruckDto;
	}

	@PostMapping(value = "/getSubscribers/{id}", produces = "application/json")
	public List<String> getSubscribers(@PathVariable("id") String id) { return foodTruckService.getSubscribers(id); }

	@PostMapping(value = "/subscribe/{foodtruckid}/{userid}", produces = "application/json")
	public void subscribe(@PathVariable("foodtruckid") String ftid, @PathVariable("userid") String userid) {
		foodTruckService.subscribe(ftid, userid);
	}

	/**
	 * This function returns a list of food trucks based on an owner id
	 * @param owner_id the owner to retrieve food trucks for
	 * @return A list of food trucks
	 */
	@GetMapping(value = "/getFoodTrucksByOwner", produces = "application/json")
	public Optional<List<FoodTruckDto>> getFoodTrucksByOwner(Long owner_id){
		return foodTruckService.getFoodTrucksByOwner(owner_id);
	}
}