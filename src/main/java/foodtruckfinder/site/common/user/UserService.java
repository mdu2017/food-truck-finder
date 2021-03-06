package foodtruckfinder.site.common.user;

import alloy.util._Lists;
import foodtruckfinder.site.common.External.Notification;
import foodtruckfinder.site.common.External.Rating;
import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// import javax.jws.soap.SOAPBinding.Use;

/**
 * Services are Spring concepts for classes which manage the application's business logic.
 */
@Service
public class UserService {
	@Autowired
	private UserDao userDao;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public Optional<UserDto> findUserByPrincipal(String principal) {
		return userDao.findUserByPrincipal(principal).map(UserAuthenticationDto::getUser);
	}

	public Optional<UserAuthenticationDto> findUserAuthenticationByPrincipal(String principal) {
		return userDao.findUserByPrincipal(principal);
	}

	public Optional<UserDto> findUserByUsername(String username) {
		return userDao.findUserByUsername(username);
	}

	public Optional<List<UserDto>> searchUsers(String username) {
		return userDao.searchUsers(username);
	}

	public Optional<UserDto> findUserByID(Long user_ID) {
		return userDao.findUserByID(user_ID);
	}

	public static class RegistrationRequest {
		private String principal;
		private String password;
		private String username;
		private boolean owner;
		private Map<String, Object> attributes;

		public String getPrincipal() {
			return principal;
		}

		public void setPrincipal(String principal) {
			this.principal = principal;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public boolean getOwner() {
			return owner;
		}

		public void setOwner(boolean owner) {
			this.owner = owner;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public Map<String, Object> getAttributes() {
			return attributes;
		}

		public void setAttributes(Map<String, Object> attributes) {
			this.attributes = attributes;
		}
	}

	public UserDto register(RegistrationRequest request) {
		//Initialize variables
		String username = request.getUsername();
		String principal = request.getPrincipal();
		UserDto userDto = new UserDto();
		System.out.println("Checking if the user is in the database: " + request.getUsername() + ", " + request.getPrincipal());
		//Check that username is not already in Database;
		if(findUserByUsername(username).isPresent()){
			System.out.println("Found the user in the database by uname");
			//If the user already exists, set all to null and return err code
			userDto.setId(-1L);
			userDto.setPrincipal(null);
			userDto.setUsername(null);
			userDto.setIsOwner(false);
			userDto.setRoles(null);

			return userDto;
		}//Check the principal
		else if(findUserByPrincipal(principal).isPresent()){
			System.out.println("Found the user in the database by email");
			//Repeat process from above
			userDto.setId(-2L);
			userDto.setPrincipal(null);
			userDto.setUsername(null);
			userDto.setIsOwner(false);
			userDto.setRoles(null);

			return userDto;
		}
		else{
			System.out.println("Didn't find the user in the database");
			userDto.setPrincipal(request.getPrincipal());
			userDto.setUsername(request.getUsername());
			userDto.setIsOwner(request.getOwner());
			userDto.setRoles(_Lists.list("ROLE_USER"));

			UserAuthenticationDto userAuthenticationDto = new UserAuthenticationDto();
			userAuthenticationDto.setUser(userDto);
			userAuthenticationDto.setPassword(passwordEncoder.encode(request.getPassword()));

			userAuthenticationDto = userDao.save(userAuthenticationDto);
			return userAuthenticationDto.getUser();
		}
	}

	public static class UpdateRequest {
		private String principal;
		private String password;
		private String username;
		private boolean owner;
		private long id;
		private Map<String, Object> attributes;

		//User preferences
		private double prefDistance = 0.5;
		private List<FoodTruckDto.FoodType> prefFoodTypes = new ArrayList<FoodTruckDto.FoodType>();
		private double prefHigh = 1000.0;
		private double prefLow = 0.0;

		public double getPrefDistance() {
			return prefDistance;
		}

		public void setPrefDistance(double prefDistance) {
			this.prefDistance = prefDistance;
		}

		public List<FoodTruckDto.FoodType> getPrefFoodTypes() {
			return prefFoodTypes;
		}

		public void setPrefFoodTypes(List<FoodTruckDto.FoodType> prefFoodTypes) {
			this.prefFoodTypes = prefFoodTypes;
		}

		public double getPrefHigh() {
			return prefHigh;
		}

		public void setPrefHigh(double prefHigh) {
			this.prefHigh = prefHigh;
		}

		public double getPrefLow() {
			return prefLow;
		}

		public void setPrefLow(double prefLow) {
			this.prefLow = prefLow;
		}

		public String getPrincipal() {
			return principal;
		}

		public void setPrincipal(String principal) {
			this.principal = principal;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public boolean getOwner() {
			return owner;
		}

		public void setOwner(boolean owner) {
			this.owner = owner;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public Map<String, Object> getAttributes() {
			return attributes;
		}

		public void setAttributes(Map<String, Object> attributes) {
			this.attributes = attributes;
		}

		public long getId() {
			return id;
		}

		public void setId(long id) {
			this.id = id;
		}
	}

	public UserDto update(UpdateRequest request) {
		UserDto userDto = new UserDto();
		userDto.setPrincipal(request.getPrincipal());
		userDto.setUsername(request.getUsername());
		userDto.setIsOwner(request.getOwner());
		userDto.setRoles(_Lists.list("ROLE_USER"));
		userDto.setId(request.getId());
		userDto.setPrefDistance(request.getPrefDistance());
		userDto.setPrefHigh(request.getPrefHigh());
		userDto.setPrefLow(request.getPrefLow());
		userDto.setPrefFoodTypes(request.getPrefFoodTypes());

		UserAuthenticationDto userAuthenticationDto = new UserAuthenticationDto();
		userAuthenticationDto.setUser(userDto);

		userAuthenticationDto.setPassword(passwordEncoder.encode(request.getPassword()));
		userAuthenticationDto = userDao.save(userAuthenticationDto);

		return userAuthenticationDto.getUser();

	}

	public List<Long> getSubscriptions(String id) { return userDao.getSubscriptions(Long.parseLong(id)); }

	public Optional<List<Long>> getOwnedFoodTrucks(Long id) { return userDao.getOwnedFoodTrucks(id); }

	public Optional<List<Notification>> getNotifications(Long userId) {
		return userDao.getNotifications(userId);
	}

	public void rateTruck(Long user_ID, Long truck_ID, String message, int rating){
		if(!userDao.findUserByID(user_ID).get().getIsOwner()){
			userDao.rateTruck(user_ID, truck_ID, message, rating);
		}
	}

	public List<Rating> getRatingByUser(Long user_ID){
		return userDao.getRatingByUser(user_ID);
	}

	/**
	 * This function subscribes a user to a food truck
	 * @param truck_id the truck id
	 * @param user_id the user id
	 */
	public void subscribe(Long truck_id, Long user_id) {
		userDao.subscribe(truck_id, user_id);
	}

	public void unsubscribe(Long user_ID, Long truck_ID){
		userDao.unsubscribe(user_ID, truck_ID);
		return;
	}

	public void removeReview(Long truck_ID, Long user_ID){
		userDao.removeReview(truck_ID, user_ID);
	}

	public boolean changeNotificationStatus(Long user_ID, Long truck_ID, LocalDateTime sent){
		return userDao.changeNotificationStatus(user_ID, truck_ID, sent);
	}

	public boolean deleteNotification(Long user_ID, Long truck_ID, LocalDateTime sent){
		return userDao.deleteNotification(user_ID, truck_ID, sent);
	}

	public void setPrefFoodTypes(List<FoodTruckDto.FoodType> types, Long user_ID){
		userDao.setPrefFoodTypes(types, user_ID);
	}
}

