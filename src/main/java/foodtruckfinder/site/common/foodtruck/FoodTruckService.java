package foodtruckfinder.site.common.foodtruck;

import alloy.util.Tuple;
import foodtruckfinder.site.common.External.Rating;
import foodtruckfinder.site.common.External.scoreComparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * If this is your first time looking at Spring Services, check out the detailed explanation in UserService first.
 *
 * This is the service responsible for saving and retrieving food trucks which are in MySQL.
 */
@Service
public class FoodTruckService {
	@Autowired
	private FoodTruckDao foodTruckDao;

	//The basic functions
	public Optional<FoodTruckDto> find(String id) {
		return foodTruckDao.find(id);
	}

	public void save(FoodTruckDto foodTruckDto) throws SQLException {
		foodTruckDao.save(foodTruckDto);
	}

	/**
	 * Removes a truck
	 * @param truck_id the truck to remove
	 */
	public boolean remove(Long truck_id){
		Optional<FoodTruckDto> ft = find(truck_id + "");
		if(ft.isPresent()){
			String mess = "The food truck \"" + ft.get().getName() + "\" that you subscribed to has been removed.";
			this.sendNotification(mess, truck_id);
		}

		return foodTruckDao.remove(truck_id);
	}

	//get by owner function
	/**
	 * This returns a list of food trucks owned by the given owner id
	 * @param owner_id the owner id
	 * @return a list of food trucks owned by the given owner id
	 */
	public Optional<List<FoodTruckDto>> getFoodTrucksByOwner(Long owner_id) {
		return foodTruckDao.getByOwner(owner_id);
	}


	//Search by functions
	/** Search food truck by name */
	public Optional<List<FoodTruckDto>> searchFoodTrucks(String name) {
		return foodTruckDao.searchFoodTrucks(name);
	}

	/** Search food truck by type */
	public Optional<List<FoodTruckDto>> searchFoodTrucksByType(String type) {
		return foodTruckDao.searchFoodTrucksByType(type);
	}

	/** Search truck by price */
	public Optional<List<FoodTruckDto>> searchTrucksByPrice(double maxPrice) {
		return foodTruckDao.searchTrucksByPrice(maxPrice);
	}

	/** Search truck by distance */
	public Optional<List<FoodTruckDto>> searchTrucksByDistance(double userLat, double userLng, double maxDistance) {
		System.out.println("Max distance of " + maxDistance + " from User Location (" + userLat + " , " + userLng + ")");
		return foodTruckDao.searchTrucksByDistance(userLat, userLng, maxDistance);
	}


	//Algorithms
	public List<FoodTruckDto> getRecommendations(double userlat,
												 double userlong,
												 Long user_ID) {
		List<scoreComparator> trucks = new ArrayList<>();
		List<Long> truckIds = new ArrayList<>();
		truckIds = foodTruckDao.getAllTrucks();
		for(Long curTruck : truckIds){
			scoreComparator truckScore = new scoreComparator();
			truckScore.setId(curTruck);

			double curScore = 0.0;
			curScore += foodTruckDao.getLowScore(user_ID, curTruck);
			curScore += foodTruckDao.getHighScore(user_ID, curTruck) * 2.0;
			curScore += foodTruckDao.getFoodTypeScore(user_ID, curTruck) * 3.0;
			curScore += foodTruckDao.getRatingScore(curTruck) * 3.5;
			curScore += foodTruckDao.getDistanceScore(user_ID, curTruck, userlat, userlong) * 4.0;
			curScore += foodTruckDao.getSubscribedScore(user_ID, curTruck) * 5.0;
			truckScore.setScore(curScore);
			trucks.add(truckScore);
		}

		Collections.sort(trucks, Collections.reverseOrder());
		List<FoodTruckDto> truckDtos = new ArrayList<>();
		for(int i=0; i<15 && i<trucks.size(); i++){
			Long curId = trucks.get(i).getId();
			Optional<FoodTruckDto> newTruck = foodTruckDao.find(curId.toString());
			if(newTruck.isPresent()){
				truckDtos.add(newTruck.get());
			}
		}
		return truckDtos;
	}

	public Optional<List<FoodTruckDto>> getRecommendationsUnsecure(double userlat, double userlong, double radius) {
		return getNearby(userlat, userlong, radius);
	}

	public Optional<List<FoodTruckDto>> getNearby(double userlat,
												  double userlong,
												  double radius) {
		return foodTruckDao.getNearby(userlat, userlong, radius);
	}

	/**
	 * Get a truck's location in latitude and longitude
	 * @param userlat, userlong
	 * @return
	 */
	public Optional<List<Tuple.Triple<Double, Double, FoodTruckDto>>> viewNearbyTrucks(double userlat, double userlong) {
		return foodTruckDao.viewNearbyTrucks(userlat, userlong);
	}


	//Deal functions
	public void addDeal(String message, Long truckID, LocalDateTime start, LocalDateTime end){
		foodTruckDao.addDeal(message, truckID, start, end);
	}

	public void removeDeal(Long dealID){
		foodTruckDao.removeDeal(dealID);
	}

	public Optional<Deal> getDeal(Long dealID) { return foodTruckDao.getDeal(dealID); }

	public List<Deal> getAllDeals(Long truckID) { return foodTruckDao.getAllDeals(truckID); }


	//Ratings/notification/subscription functions (misc)
	public List<Rating> getRatingByTruck(Long truck_ID){
		return foodTruckDao.getRatingByTruck(truck_ID);
	}

	/**
	 * send a message to all the owner's subscribers
	 * @param message what you want to say
	 * @param foodTruckId The food truck id
	 */
	public void sendNotification(String message, Long foodTruckId){
		foodTruckDao.sendNotification(message, foodTruckId);
	}

	/**
	 * This function gets the list of subscribers to a particular food truck
	 * @param id the truck id
	 * @return the list of usernames of people who are subscribed
	 */
	public List<String> getSubscribers(Long id) { return foodTruckDao.getSubscribers(id); }


	//Event functions
	public void addEvent(String name, String details, LocalDateTime start, LocalDateTime end, double log, double lat){
    	Stop temp = new Stop();
    	temp.setStart(start);
    	temp.setEnd(end);
    	temp.setLog(log);
    	temp.setLat(lat);
    	Long stop_ID = foodTruckDao.insertStop(temp);
    	foodTruckDao.addEvent(name, details, stop_ID);
	}

	//Remove event by id
	public void removeEvent(Long event_ID){
    	foodTruckDao.removeEvent(event_ID);
	}

	public void signUpForEvent(Long truck_ID, Long event_ID){
    	foodTruckDao.signUpForEvent(truck_ID, event_ID);
	}

	public void cancelEventSignup(Long truck_ID, Long event_ID){
    	foodTruckDao.cancelEventSignup(truck_ID, event_ID);
    	return;
	}

	//Search events by ID
	public Optional<EventDto> getEventById(Long event_ID){
    	return foodTruckDao.getEventById(event_ID);
	}

	//Get all attending trucks for an event
	public Optional<List<Optional<FoodTruckDto>>> getAttendingTrucks(Long event_ID){
		return foodTruckDao.getAttendingTrucks(event_ID);
	}

	//Get all events available
	public List<EventDto> getAllEvents() {
    	return foodTruckDao.getAllEvents();
	}

	//Search for events
	public List<EventDto> searchForEvent(String name){ return foodTruckDao.searchForEvent(name); }

	public List<Tuple.Pair<String, Stop>> mapSchedule(List<ScheduleFE> scheds){
		List<Tuple.Pair<String, Stop>> toret = new ArrayList<>();
		for (ScheduleFE e : scheds) {
			toret.add(e.getSchedule());
		}
		return toret;
	}
}
