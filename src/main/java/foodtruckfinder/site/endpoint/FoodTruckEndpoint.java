package foodtruckfinder.site.endpoint;

import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

import foodtruckfinder.site.common.foodtruck.Stop;
import foodtruckfinder.site.common.user.UserDto;
import foodtruckfinder.site.common.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.User;

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
    public FoodTruckDto saveFoodTruck(@RequestBody FoodTruckDto foodTruckDto) throws SQLException {
		//TODO: Remove this once frontend is implemented properly
		if(foodTruckDto.getStatus() == null){
			foodTruckDto.setStatus("Closed");
		} else {
			foodTruckDto.setStatus(foodTruckDto.getStatus());
		}
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

	/**
	 * This function gets a string list of food types
	 * @return the string list of food types
	 */
	@GetMapping(value = "/getFoodTypes", produces = "application/json")
	public List<String> getFoodTypes(){
		return Arrays.stream(FoodTruckDto.FoodType.values())
				     .map(FoodTruckDto.FoodType::name)
				     .collect(Collectors.toList());
	}

	/**
	 * This function gets a string list of the status
	 * @return the string list of the status
	 */
	@GetMapping(value = "/getStatusNames", produces = "application/json")
	public List<String> getStatusNames(){
		return Arrays.stream(FoodTruckDto.FTStatus.values())
                     .map(FoodTruckDto.FTStatus::name)
                     .collect(Collectors.toList());
	}

	@PostMapping(value = "/send-notification" )
	public void sendNotification(String message, Long foodTruckId){
		foodTruckService.sendNotification(message, foodTruckId);
	}
}
