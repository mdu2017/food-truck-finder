package foodtruckfinder.site.common.user;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
			rs.next();

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
		});

		return Optional.ofNullable(result);
	}

	/*Same as findUserByPrincipal but searches by Username*/
	public Optional<UserAuthenticationDto> findUserByUsername(String username) { // == get user
		String sql = "SELECT * FROM `USER` WHERE USERNAME = :username";
		Map<String, ?> parameters = _Maps.map("username", username);

		UserAuthenticationDto results = jdbcTemplate.query(sql, parameters, rs -> {
			rs.next();

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
		});

		return Optional.ofNullable(results);
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
					"PASSWORD = :password " +
					"WHERE USER_ID = :userId";

			Map<String, ?> parameters = _Maps.map(
					"principal", userAuthentication.getUser().getPrincipal(),
					"password", userAuthentication.getPassword(),
					"userId", userAuthentication.getUser().getId());

			jdbcTemplate.update(sql, parameters);
			return userAuthentication;
		}
		else {
			String sql = "INSERT INTO USER (PRINCIPAL, PASSWORD) VALUES (:principal, :password)";

			Map<String, ?> parameters = _Maps.map(
					"principal", userAuthentication.getUser().getPrincipal(),
					"password", userAuthentication.getPassword());

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
}