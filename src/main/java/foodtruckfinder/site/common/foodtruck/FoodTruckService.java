package foodtruckfinder.site.common.foodtruck;

import java.util.List;
import java.util.Optional;

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

	public void save(FoodTruckDto foodTruckDto) {
		foodTruckDao.save(foodTruckDto);
	}

	/**
	 * This function subscribes a user to a food truck
	 * @param truck_id the truck id
	 * @param user_id the user id
	 */
	public void subscribe(String truck_id, String user_id) {
		foodTruckDao.subscribe(Long.parseLong(truck_id), Long.parseLong(user_id));
	}

	/**
	 * This function gets the list of subscribers to a particular food truck
	 * @param id the truck id
	 * @return the list of usernames of people who are subscribed
	 */
	public List<String> getSubscribers(String id) { return foodTruckDao.getSubscribers(Long.parseLong(id)); }
}