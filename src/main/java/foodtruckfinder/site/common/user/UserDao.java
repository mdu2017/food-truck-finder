package foodtruckfinder.site.common.user;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import foodtruckfinder.site.common.External.Rating;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import alloy.util._Lists;
import alloy.util._Maps;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Repository
public class UserDao {

	@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
	@Autowired
	private NamedParameterJdbcTemplate jdbcTemplate;

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
                //Need this for stuffy stuff
				userDto.setRoles(_Lists.list("ROLE_USER"));
				return userAuthenticationDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

    /*Same as findUserByPrincipal but searches by Username*/
	public Optional<UserDto> findUserByUsername(String username) {
		String sql = "SELECT * FROM USER WHERE USERNAME = :username";

		Map<String, ?> parameters = _Maps.map("username", username);

		UserDto result = jdbcTemplate.query(sql, parameters, rs -> {
			if(rs.next()) {
				UserDto userDto = new UserDto();
				userDto.setId(rs.getLong("USER_ID"));
				userDto.setPrincipal(rs.getString("PRINCIPAL"));
				userDto.setUsername(rs.getString("USERNAME"));
				userDto.setIsOwner(rs.getBoolean("IS_OWNER"));
                userDto.setRoles(_Lists.list("ROLE_USER"));

				return userDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	/**
	 * This function saves a user to the database, and if it doesn't have an id, it creates one and inserts it into the database.
	 *
	 * This needs to check that email is unique**
	 * @param userAuthentication the authenticated user
	 * @return the updated authenticated user
	 */
	public UserAuthenticationDto save(UserAuthenticationDto userAuthentication) { // == register/update user
		if(userAuthentication.getUser().getId() != null) {
			String sql = "UPDATE USER SET " +
					"PRINCIPAL = :principal, " +
					"PASSWORD = :password, " +
					"USERNAME = :username, " +
					"IS_OWNER = :owner " +
					"WHERE USER_ID = :userId";

			Map<String, ?> parameters = _Maps.map(
					"principal", userAuthentication.getUser().getPrincipal(),
					"username", userAuthentication.getUser().getUsername(),
					"password", userAuthentication.getPassword(),
					"userId", userAuthentication.getUser().getId(),
					"owner", userAuthentication.getUser().getIsOwner());

			jdbcTemplate.update(sql, parameters);
			return userAuthentication;
		}
		else {
			String sql = "INSERT INTO USER (PRINCIPAL, USERNAME, PASSWORD, IS_OWNER) VALUES (:principal, :username, :password, :isOwner)";

			Map<String, ?> parameters = _Maps.map(
					"principal", userAuthentication.getUser().getPrincipal(),
					"password", userAuthentication.getPassword(),
					"username", userAuthentication.getUser().getUsername(),
					"isOwner", userAuthentication.getUser().getIsOwner());

			KeyHolder keyHolder = new GeneratedKeyHolder();

			jdbcTemplate.update(sql, new MapSqlParameterSource(parameters), keyHolder);

			BigInteger key = (BigInteger) keyHolder.getKey();
			userAuthentication.getUser().setId(key.longValue());
			return userAuthentication;
		}
	}

	public List<String> getSubscriptions(Long user_id){
		//todo:: fix this because name is not necessarily unique
		//is that actually a problem though?  Yes duplicates will show up but so what?
		//One user is subscribed to multiple "Torchy's Tacos"
		String sql = "SELECT name FROM SUBSCRIPTIONS, FOOD_TRUCK WHERE " +
				"SUBSCRIPTIONS.TRUCK_ID = FOOD_TRUCK.TRUCK_ID AND USER_ID = :user_id";

		Map<String, ?> params = _Maps.map("user_id", user_id);
        return jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("name"));
	}

	public Optional<List<Long>> getOwnedFoodTrucks(Long owner_id){
		String sql = "SELECT FOOD_TRUCK_ID FROM FOOD_TRUCK WHERE " +
				"OWNER_ID = :owner_id";

		Map<String, ?> params = _Maps.map("owner_id", owner_id);
		return Optional.ofNullable(jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getLong("FOOD_TRUCK_ID")));
	}

	public Optional<List<String>> getNotifications(Long userId){
		String sql = "SELECT message FROM NOTIFICATION WHERE " +
					 "USER_ID = :userId";

		Map<String, ?> params = _Maps.map("userId", userId);
		return Optional.ofNullable(jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("message")));
	}
//"INSERT INTO USER (PRINCIPAL, USERNAME, PASSWORD, IS_OWNER) VALUES (:principal, :username, :password, :isOwner)";
	public void rateTruck(Long user_ID, Long truck_ID, String message, int rating){
		String sql = "INSERT INTO REVIEW (TRUCK_ID, USER_ID, MESSAGE, RATING, DATE) VALUES(:truck_ID, :user_ID, :message, :rating, NOW())";
		Map<String, ?> params = _Maps.map("user_ID", user_ID, "truck_ID", truck_ID, "message", message, "rating", rating);

		jdbcTemplate.update(sql, params);
		return;
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
			temp.setRating(rs.getInt("RATING"));


			return temp;
		});

		return r;
	}

	public List<Rating> getRatingByTruck(Long truck_ID){
		String sql = "SELECT * FROM REVIEW WHERE TRUCK_ID = :truck_ID";
		Map<String, ?> params = _Maps.map("truck_ID", truck_ID);

		List<Rating> r = jdbcTemplate.query(sql, params, (rs, rownum) -> {
			Rating temp = new Rating();

			temp.setTruck(truck_ID);
			temp.setUser(rs.getLong("USER_ID"));
			temp.setDate(rs.getTimestamp("DATE").toLocalDateTime());
			temp.setMessage(rs.getString("MESSAGE"));
			temp.setRating(rs.getInt("RATING"));

			return temp;
		});

		return r;
	}
}
