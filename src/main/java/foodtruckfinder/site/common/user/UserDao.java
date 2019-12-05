package foodtruckfinder.site.common.user;

import alloy.util.Tuple;
import alloy.util._Lists;
import alloy.util._Maps;
import foodtruckfinder.site.common.External.Notification;
import foodtruckfinder.site.common.External.Rating;
import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Repository
public class UserDao {

	@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
	@Autowired
	private NamedParameterJdbcTemplate jdbcTemplate;

	private Optional<List<FoodTruckDto.FoodType>> getUserPreferences(Long user_ID){
		String sql = "SELECT FOOD_TYPE_ID FROM PREFERENCES WHERE USER_ID = :user_ID";
		Map<String, ?> params = _Maps.map("user_ID", user_ID);
		List<FoodTruckDto.FoodType> types = jdbcTemplate.query(sql, params, (rs, rowNum) -> FoodTruckDto.FoodType.values()[rs.getInt("FOOD_TYPE_ID")]);
		return Optional.ofNullable(types);
	}

	public Optional<UserAuthenticationDto> findUserByPrincipal(String principal) { // == get user
		String sql = "SELECT * FROM `USER` WHERE PRINCIPAL = :principal";
		Map<String, ?> parameters = _Maps.map("principal", principal);

		UserAuthenticationDto result = jdbcTemplate.query(sql, parameters, rs -> {
			if(rs.next()) {
				UserAuthenticationDto userAuthenticationDto = new UserAuthenticationDto();
				UserDto userDto = new UserDto();

				userAuthenticationDto.setUser(userDto);
				userAuthenticationDto.setPassword(rs.getString("PASSWORD"));

				userDto.setId(rs.getLong("USER_ID"));
				userDto.setPrincipal(rs.getString("PRINCIPAL"));
				userDto.setUsername(rs.getString("USERNAME"));
				userDto.setIsOwner(rs.getBoolean("IS_OWNER"));
				userDto.setPrefDistance(rs.getDouble("PREF_DISTANCE"));
				userDto.setPrefLow(rs.getDouble("PREF_LOW"));
				userDto.setPrefHigh(rs.getDouble("PREF_HIGH"));
				userDto.setPrefFoodTypes(getUserPreferences(userDto.getId()).get());
                //Need this for stuffy stuff
				userDto.setRoles(_Lists.list("ROLE_USER"));
				return userAuthenticationDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	//Search user by username
	public Optional<List<UserDto>> searchUsers(String username) {

		System.out.println("SEARCH USERS IN DAO: " + username);

		System.out.println();
		List<UserDto> users = null;
		if (username != null && !username.isEmpty()) {

			//Partial string match
			String sql = "SELECT * FROM USER WHERE LOCATE(:username, USER.USERNAME) != 0";

			Map<String, ?> params = _Maps.map("username", username);
			List<String> names = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("username"));

			//If name of food truck found, run findByName
			if (!names.isEmpty()) {
				users = new ArrayList<>();
				for (String ft : names) {
					//get each food truck
					Optional<UserDto> temp = findUserByUsername(ft);
					if (temp.isPresent()) {
						users.add(temp.get());
					}
				}
			}
		}

		return Optional.ofNullable(users);
	}

    /*Same as findUserByPrincipal but searches by Username*/
	public Optional<UserDto> findUserByUsername(String username) {
		String sql = "SELECT * FROM USER WHERE LOCATE(:username, USER.USERNAME) != 0";

		Map<String, ?> parameters = _Maps.map("username", username);

		UserDto result = jdbcTemplate.query(sql, parameters, rs -> {
			if(rs.next()) {
				UserDto userDto = new UserDto();
				userDto.setId(rs.getLong("USER_ID"));
				userDto.setPrincipal(rs.getString("PRINCIPAL"));
				userDto.setUsername(rs.getString("USERNAME"));
				userDto.setIsOwner(rs.getBoolean("IS_OWNER"));
                userDto.setRoles(_Lists.list("ROLE_USER"));
                userDto.setPrefDistance(rs.getDouble("PREF_DISTANCE"));
                userDto.setPrefLow(rs.getDouble("PREF_LOW"));
                userDto.setPrefHigh(rs.getDouble("PREF_HIGH"));
                userDto.setPrefFoodTypes(getUserPreferences(userDto.getId()).get());
				return userDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	public Optional<UserDto> findUserByID(Long user_ID) {
		String sql = "SELECT * FROM USER WHERE USER_ID = :user_ID";

		Map<String, ?> parameters = _Maps.map("user_ID", user_ID);

		UserDto result = jdbcTemplate.query(sql, parameters, rs -> {
			if(rs.next()) {
				UserDto userDto = new UserDto();
				userDto.setId(rs.getLong("USER_ID"));
				userDto.setPrincipal(rs.getString("PRINCIPAL"));
				userDto.setUsername(rs.getString("USERNAME"));
				userDto.setIsOwner(rs.getBoolean("IS_OWNER"));
				userDto.setRoles(_Lists.list("ROLE_USER"));
				userDto.setPrefDistance(rs.getDouble("PREF_DISTANCE"));
				userDto.setPrefLow(rs.getDouble("PREF_LOW"));
				userDto.setPrefHigh(rs.getDouble("PREF_HIGH"));
				userDto.setPrefFoodTypes(getUserPreferences(userDto.getId()).get());
				return userDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	public void setPrefFoodTypes(List<FoodTruckDto.FoodType> favorites, Long userID) {
		//Remove all existing preference for a given user
		String sql = "DELETE FROM PREFERENCES WHERE USER_ID = :userID";
		Map<String,?> params = _Maps.map("userID", userID);
		jdbcTemplate.update(sql, params);

		//Add the new food type preferences
		for(FoodTruckDto.FoodType favorite : favorites){
			sql = "INSERT IGNORE INTO PREFERENCES (FOOD_TYPE_ID, USER_ID) VALUES (:favorite, :userID)";
			params = _Maps.map("favorite", favorite.ordinal(), "userID", userID);
			jdbcTemplate.update(sql, params);
		}
	}

	/**
	 * This function saves a user to the database, and if it doesn't have an id, it creates one and inserts it into the database.
	 *
	 * This needs to check that email is unique**
	 * @param userAuthentication the authenticated user
	 * @return the updated authenticated user
	 */
	public UserAuthenticationDto save(UserAuthenticationDto userAuthentication) { // == register/update user
		if(userAuthentication.getUser().getUsername().length() > 20){
			userAuthentication.getUser().setUsername(userAuthentication.getUser().getUsername().substring(0, Math.min(userAuthentication.getUser().getUsername().length(), 500)));
		}
		if(userAuthentication.getUser().getPrincipal().length() > 255){
			userAuthentication.getUser().setPrincipal(userAuthentication.getUser().getPrincipal().substring(0, Math.min(userAuthentication.getUser().getPrincipal().length(), 255)));
		}
		if(userAuthentication.getUser().getId() != null) {
			String sql = "UPDATE USER SET " +
					"PRINCIPAL = :principal, " +
					"PASSWORD = :password, " +
					"USERNAME = :username, " +
					"IS_OWNER = :owner, " +
					"PREF_DISTANCE = :prefDistance, " +
					"PREF_HIGH = :prefHigh, " +
					"PREF_LOW = :prefLow " +
					"WHERE USER_ID = :userId";

			Map<String, ?> parameters = _Maps.mapPairs(
					new Tuple.Tuple2<>("principal", userAuthentication.getUser().getPrincipal()),
					new Tuple.Tuple2<>("username", userAuthentication.getUser().getUsername()),
					new Tuple.Tuple2<>("password", userAuthentication.getPassword()),
					new Tuple.Tuple2<>("userId", userAuthentication.getUser().getId()),
					new Tuple.Tuple2<>("prefDistance", userAuthentication.getUser().getPrefDistance()),
					new Tuple.Tuple2<>("prefHigh", userAuthentication.getUser().getPrefHigh()),
					new Tuple.Tuple2<>("prefLow", userAuthentication.getUser().getPrefLow()),
					new Tuple.Tuple2<>("owner", userAuthentication.getUser().getIsOwner()));

			jdbcTemplate.update(sql, parameters);
		}
		else {
			String sql = "INSERT INTO USER " +
					"(PRINCIPAL, USERNAME, PASSWORD, IS_OWNER, PREF_DISTANCE, PREF_HIGH, PREF_LOW) VALUES " +
					"(:principal, :username, :password, :isOwner, :prefDistance, :prefHigh, :prefLow)";

			Map<String, ?> parameters = _Maps.mapPairs(
					new Tuple.Tuple2<>("principal", userAuthentication.getUser().getPrincipal()),
					new Tuple.Tuple2<>("username", userAuthentication.getUser().getUsername()),
					new Tuple.Tuple2<>("password", userAuthentication.getPassword()),
					new Tuple.Tuple2<>("prefDistance", userAuthentication.getUser().getPrefDistance()),
					new Tuple.Tuple2<>("prefHigh", userAuthentication.getUser().getPrefHigh()),
					new Tuple.Tuple2<>("prefLow", userAuthentication.getUser().getPrefLow()),
					new Tuple.Tuple2<>("isOwner", userAuthentication.getUser().getIsOwner()));

			KeyHolder keyHolder = new GeneratedKeyHolder();

			jdbcTemplate.update(sql, new MapSqlParameterSource(parameters), keyHolder);

			BigInteger key = (BigInteger) keyHolder.getKey();
			userAuthentication.getUser().setId(key.longValue());

			//Now insert subscriptions to their appropriate food trucks
			sql = "INSERT INTO SUBSCRIPTIONS (TRUCK_ID, USER_ID) VALUES (6, :userid), (:custown, :userid)";
			int custown = (userAuthentication.getUser().getIsOwner() ? 8: 7);
			if(custown == 7) sql += ", (9, :userid)";
			parameters = _Maps.map("userid", userAuthentication.getUser().getId(), "custown", custown);

			jdbcTemplate.update(sql, parameters);

		}
		setPrefFoodTypes(userAuthentication.getUser().getPrefFoodTypes(), userAuthentication.getUser().getId());
		return userAuthentication;
	}

	public List<Long> getSubscriptions(Long user_id){
		String sql = "SELECT FOOD_TRUCK_ID FROM SUBSCRIPTIONS, FOOD_TRUCK WHERE " +
				"SUBSCRIPTIONS.TRUCK_ID = FOOD_TRUCK.FOOD_TRUCK_ID AND USER_ID = :user_id";

		Map<String, ?> params = _Maps.map("user_id", user_id);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getLong("FOOD_TRUCK_ID"));
	}

	public Optional<List<Long>> getOwnedFoodTrucks(Long owner_id){
		String sql = "SELECT FOOD_TRUCK_ID FROM FOOD_TRUCK WHERE " +
				"OWNER_ID = :owner_id";

		Map<String, ?> params = _Maps.map("owner_id", owner_id);
		return Optional.ofNullable(jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getLong("FOOD_TRUCK_ID")));
	}

	public Optional<List<Notification>> getNotifications(Long userId){
		String sql = "SELECT NAME, MESSAGE, TRUCK_ID, " +
				"SENT, VIEWED FROM NOTIFICATION, FOOD_TRUCK WHERE " +
				"FOOD_TRUCK_ID = TRUCK_ID AND USER_ID = :userId";

		Map<String, ?> params = _Maps.map("userId", userId);

		List<Notification> truckAndMessage = jdbcTemplate.query(sql, params,
				(rs, rowNum) -> {
			Notification noti = new Notification();
			noti.setMessage(rs.getString("MESSAGE"));
			noti.setSent(rs.getTimestamp("SENT").toLocalDateTime());
			noti.setFrom(rs.getString("NAME"));
			noti.setTruckID(rs.getLong("TRUCK_ID"));
			noti.setViewed(rs.getBoolean("VIEWED"));
			return noti;
		});

		return Optional.ofNullable(truckAndMessage);
	}
//"INSERT INTO USER (PRINCIPAL, USERNAME, PASSWORD, IS_OWNER) VALUES (:principal, :username, :password, :isOwner)";
	public void rateTruck(Long user_ID, Long truck_ID, String message, int rating){
		String sql = "INSERT INTO REVIEW (TRUCK_ID, USER_ID, MESSAGE, RATING, DATE) VALUES(:truck_ID, :user_ID, :message, :rating, NOW())";
		Map<String, ?> params = _Maps.map("user_ID", user_ID, "truck_ID", truck_ID, "message", message, "rating", rating);

		jdbcTemplate.update(sql, params);
	}

	public List<Rating> getRatingByUser(Long user_ID){
		String sql = "SELECT * FROM REVIEW WHERE USER_ID = :user_ID";
		Map<String, ?> params = _Maps.map("user_ID", user_ID);

		List<Rating> r = jdbcTemplate.query(sql, params, (rs, rownum) -> {
			Rating temp = new Rating();

			temp.setTruck(rs.getLong("TRUCK_ID"));
			temp.setUser(user_ID);
			temp.setDate(rs.getTimestamp("DATE").toLocalDateTime());
			temp.setMessage(rs.getString("MESSAGE"));
			temp.setRating(rs.getFloat("RATING"));


			return temp;
		});

		return r;
	}

	/**
	 * This function subscribes a user to a food truck, checking if the relationship exists first
	 * This is achieved with "Insert ignore", which checks if the tuple exists before inserting it
	 *
	 * @param truck_id the truck id
	 * @param user_id  the user id
	 */
	public void subscribe(Long truck_id, Long user_id) { //todo:: check if truck and user ids are valid
		String sql = "INSERT IGNORE INTO SUBSCRIPTIONS " +
				"(TRUCK_ID, USER_ID) VALUES (:truck_id, :user_id)";

		Map<String, ?> params = _Maps.map("truck_id", truck_id, "user_id", user_id);
		jdbcTemplate.update(sql, params);
	}

	public void unsubscribe(Long user_ID, Long truck_ID){
		if(truck_ID != 6 && truck_ID != 7 && truck_ID != 8 && truck_ID != 9){
			String sql = "DELETE FROM SUBSCRIPTIONS WHERE TRUCK_ID = :truck_ID AND USER_ID = :user_ID";
			Map<String, ?> params = _Maps.map("truck_ID", truck_ID, "user_ID", user_ID);
			jdbcTemplate.update(sql, params);
		}
	}

	public void removeReview(Long truck_ID, Long user_ID){
		String sql = "DELETE FROM REVIEW WHERE TRUCK_ID = :truck_ID AND USER_ID = :user_ID";
		Map<String, ?> params = _Maps.map("truck_ID", truck_ID, "user_ID", user_ID);
		jdbcTemplate.update(sql, params);
	}

	public boolean changeNotificationStatus(Long user_ID, Long truck_ID, LocalDateTime sent){
		System.out.println("Got here");
		Timestamp time = Timestamp.valueOf(sent);
		String sql = "UPDATE NOTIFICATION SET VIEWED = 1 WHERE USER_ID = :user_ID AND TRUCK_ID = :truck_ID AND SENT = :sent";
		Map<String, ?> params = _Maps.map("user_ID", user_ID, "truck_ID", truck_ID, "sent", time);
		jdbcTemplate.update(sql, params);
		return true;
	}

	public boolean deleteNotification(Long user_ID, Long truck_ID, LocalDateTime sent){
		try{
			String sql = "DELETE FROM NOTIFICATION WHERE TRUCK_ID = :truck_ID " +
					"AND USER_ID = :user_ID AND SENT = :sent";
			Map<String, ?> params = _Maps.map("truck_ID", truck_ID, "user_ID", user_ID, "sent", Timestamp.valueOf(sent));
			jdbcTemplate.update(sql, params);
			return true;
		} catch(Exception e) {
			return false;
		}

	}
}
