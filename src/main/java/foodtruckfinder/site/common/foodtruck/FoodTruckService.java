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

	//TODO: function to get food truck by name

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
	}

	public void removeDeal(Long truckID){
		foodTruckDao.removeDeal(truckID);
	}

	/**
	 * This function subscribes a user to a food truck
	 * @param truck_id the truck id
	 * @param user_id the user id
	 */
	public void subscribe(Long truck_id, Long user_id) {
		foodTruckDao.subscribe(truck_id, user_id);
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

    public Optional<Tuple.Pair<Double, Double>> getCurrentLocation(Long foodTruckId) {
		return foodTruckDao.getCurrentLocation(foodTruckId);
    }

	public List<Rating> getRatingByTruck(Long truck_ID){
		return foodTruckDao.getRatingByTruck(truck_ID);
	}
}
