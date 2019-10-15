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

	@Autowired
	private NamedParameterJdbcTemplate jdbcTemplate;

	public Optional<UserAuthenticationDto> findUserByPrincipal(String principal) { // == get user
		String sql = "SELECT * FROM `USER` WHERE PRINCIPAL = :principal";
		Map<String, ?> parameters = _Maps.map("principal", principal);

		UserAuthenticationDto result = jdbcTemplate.query(sql, parameters, rs -> {
			if(!rs.isLast()) {
				rs.next();

				UserAuthenticationDto userAuthenticationDto = new UserAuthenticationDto();
				UserDto userDto = new UserDto();
				userAuthenticationDto.setUser(userDto);
				userAuthenticationDto.setPassword(rs.getString("PASSWORD"));
				userDto.setId(rs.getLong("USER_ID"));
				userDto.setPrincipal(rs.getString("PRINCIPAL"));
				userDto.setUsername(rs.getString("Username"));
				userDto.setIsOwner(rs.getBoolean("isOwner"));
				userDto.setRoles(_Lists.list("ROLE_USER"));
				return userAuthenticationDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	public Optional<UserDto> findUserByUsername(String username) {
		String sql = "SELECT * FROM `USER` WHERE Username = :username";
		Map<String, ?> parameters = _Maps.map("principal", username);

		UserDto result = jdbcTemplate.query(sql, parameters, rs -> {
			if(!rs.isLast()) {
				rs.next();

				UserDto userDto = new UserDto();
				userDto.setUsername(rs.getString("Username"));

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
					"Username = :username, " +
					"isOwner = :owner " +
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
			String sql = "INSERT INTO USER (PRINCIPAL, Username, PASSWORD, isOwner) VALUES (:principal, :username, :password, :isOwner)";

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
}