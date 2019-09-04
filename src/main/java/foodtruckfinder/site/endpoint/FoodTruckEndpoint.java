package foodtruckfinder.site.endpoint;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	@PostMapping(produces = "application/json")
	public FoodTruckDto saveFoodTruck(@RequestBody FoodTruckDto foodTruckDto) {
		foodTruckService.save(foodTruckDto);
		return foodTruckDto;
	}
}