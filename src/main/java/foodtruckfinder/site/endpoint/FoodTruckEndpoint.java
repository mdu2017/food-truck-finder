package foodtruckfinder.site.endpoint;

import foodtruckfinder.site.common.foodtruck.*;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

	//The basic functions
	// Take a JSON representation of a food truck and save it to the database
	@PostMapping(value = "/save", produces = "application/json")
	public FoodTruckDto saveFoodTruck(@RequestBody FoodTruckDto foodTruckDto) throws SQLException {

		System.out.print("============MENU====================");
		System.out.println(foodTruckDto.getMenu());

		System.out.println(foodTruckDto);

		foodTruckService.save(foodTruckDto);
		return foodTruckDto;
	}

    @PostMapping(value = "/removeTruck", produces = "application/json")
	public boolean removeTruck(Long truck_id){
		return foodTruckService.remove(truck_id);
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

	//Deal functions
	@PostMapping(value = "/addDeal", produces = "application/json")
	public void addDeal(String message, Long truckID, String start,
						String end) {
		LocalDateTime startDT = LocalDateTime.parse(start);
		LocalDateTime endDT = LocalDateTime.parse(end);
		foodTruckService.sendNotification(message, truckID);
		foodTruckService.addDeal(message, truckID, startDT, endDT);
	}

	@PostMapping(value = "/removeDeal", produces = "application/json")
	public void removeDeal(Long truckID) {
		foodTruckService.removeDeal(truckID);
	}

	@PostMapping(value = "/getDeal", produces = "application/json")
	public Optional<Deal> getDeal(Long dealID) { return foodTruckService.getDeal(dealID); }

	@GetMapping(value = "/getAllDeals", produces = "application/json")
	public List<Deal> getAllDeals(Long truckID) { return foodTruckService.getAllDeals(truckID); }


	//Ratings/notification/subscription functions (misc)
	@PostMapping(value = "/send-notification", produces = "application/json" )
	public void sendNotification(String message, Long foodTruckId){
		foodTruckService.sendNotification(message, foodTruckId);
	}

	@GetMapping(value = "/getSubscribers/{id}", produces = "application/json")
	public List<String> getSubscribers(@PathVariable("id") Long id) { return foodTruckService.getSubscribers(id); }


	//Get enums
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


	//Event functions
    @PostMapping(value = "/addEvent", produces = "application/json")
	public void addEvent(String name, String details, Integer[] start, Integer[] end, double log, double lat){
		LocalDateTime startTime = LocalDateTime.of(start[0], start[1], start[2],
				start[3], start[4], start[5]);
		LocalDateTime endTime = LocalDateTime.of(end[0], end[1], end[2],
				end[3], end[4], end[5]);
		foodTruckService.addEvent(name, details, startTime, endTime, log, lat);
		return;
	}

	@PostMapping(value = "/removeEvent", produces = "application/json")
	public void removeEvent(Long event_ID){
		foodTruckService.removeEvent(event_ID);
		return;
	}

	@PostMapping(value = "/signUpForEvent", produces = "application/json")
	public void signUpForEvent(Long event_ID, Long truck_ID){
		foodTruckService.signUpForEvent(event_ID, truck_ID);
		return;
	}

	@PostMapping(value = "/cancelEventSignup", produces = "application/json")
	public void cancelEventSignup(Long truck_ID, Long event_ID){
		foodTruckService.cancelEventSignup(truck_ID, event_ID);
		return;
	}

	@GetMapping(value = "/getEventById", produces = "application/json")
	public Optional<EventDto> getEventById(Long event_ID){
		return foodTruckService.getEventById(event_ID);
	}

	@GetMapping(value = "/getAttendingTrucks", produces = "application/json")
	public Optional<List<Optional<FoodTruckDto>>> getAttendingTrucks(Long event_ID){ return foodTruckService.getAttendingTrucks(event_ID); }

	@GetMapping(value = "/getAllEvents", produces = "application/json")
	public List<EventDto> getAllEvents(){
		return foodTruckService.getAllEvents();
	}

	@PostMapping(value = "/searchForEvent", produces = "application/json")
	public List<EventDto> searchForEvent(String name){ return foodTruckService.searchForEvent(name); }

	//Algorithms
	@GetMapping(value = "/recommendationsSecure", produces = "application/json")
	public List<FoodTruckDto> getRecommendations(double userlat,
												 double userlong,
												 Long user_ID) {
		return foodTruckService.getRecommendations(userlat, userlong, user_ID);
	}


}
