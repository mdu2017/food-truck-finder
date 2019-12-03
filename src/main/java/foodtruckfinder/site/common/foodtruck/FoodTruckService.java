package foodtruckfinder.site.common.foodtruck;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import alloy.util.Tuple;
import foodtruckfinder.site.common.External.Rating;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * If this is your first time looking at Spring Services, check out the detailed explanation in UserService first.
 *
 * This is the service responsible for saving and retrieving food trucks which are in MySQL.
 */
@Service
public class FoodTruckService {
	@Autowired
	private FoodTruckDao foodTruckDao;

	public Optional<FoodTruckDto> find(String id) {
		return foodTruckDao.find(id);
	}


	public void save(FoodTruckDto foodTruckDto) throws SQLException {
//        foodTruckDao.testFT(foodTruckDto);
		foodTruckDao.save(foodTruckDto);
	}

	/**
	 *
	 * @param truck_id
	 */
	public boolean remove(Long truck_id){
		return foodTruckDao.remove(truck_id);
	}

	public void addDeal(String message, Long truckID, LocalDateTime start, LocalDateTime end){
		foodTruckDao.addDeal(message, truckID, start, end);
		Optional<FoodTruckDto> ft = foodTruckDao.find(truckID + "");
		if(ft.isPresent()){
			String notifMessage = "[" +  ft.get().getName() + "]: " + message;
			foodTruckDao.sendNotification(notifMessage, truckID);
		}
	}

	public void removeDeal(Long truckID){
		foodTruckDao.removeDeal(truckID);
	}

	/**
	 * This function gets the list of subscribers to a particular food truck
	 * @param id the truck id
	 * @return the list of usernames of people who are subscribed
	 */
	public List<String> getSubscribers(Long id) { return foodTruckDao.getSubscribers(id); }

	/**
	 * This returns a list of food trucks owned by the given owner id
	 * @param owner_id the owner id
	 * @return a list of food trucks owned by the given owner id
	 */
	public Optional<List<FoodTruckDto>> getFoodTrucksByOwner(Long owner_id) {
		return foodTruckDao.getByOwner(owner_id);
	}

	//TODO: WIP
	public Optional<List<FoodTruckDto>> searchFoodTrucks(String name) {
		return foodTruckDao.searchFoodTrucks(name);
	}

    /**
     * send a message to all the owner's subscribers
     * @param message what you want to say
     * @param foodTruckId The food truck id
     */
	public void sendNotification(String message, Long foodTruckId){
        foodTruckDao.sendNotification(message, foodTruckId);
	}

	public Optional<List<FoodTruckDto>> getRecommendations(double userlat,
														   double userlong,
														   double radius) {
		return foodTruckDao.getRecommendations(userlat, userlong, radius);
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

	public List<Rating> getRatingByTruck(Long truck_ID){
		return foodTruckDao.getRatingByTruck(truck_ID);
	}

	public void addEvent(String details, LocalDateTime start, LocalDateTime end, double log, double lat){
    	Stop temp = new Stop();
    	temp.setStart(start);
    	temp.setEnd(end);
    	temp.setLog(log);
    	temp.setLat(lat);
    	Long stop_ID = foodTruckDao.insertStop(temp);
    	foodTruckDao.addEvent(details, stop_ID);
	}

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

	public Optional<EventDto> getEventById(Long event_ID){
    	return foodTruckDao.getEventById(event_ID);
	}

	public Optional<List<Long>> getAttendingTrucks(Long event_ID){
    	return foodTruckDao.getAttendingTrucks(event_ID);
	}
}
