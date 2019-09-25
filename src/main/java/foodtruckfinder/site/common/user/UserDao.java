package foodtruckfinder.site.common.user;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
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

	public Optional<UserAuthenticationDto> findUserByPrincipal(String principal) {
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
			userDto.setRoles(_Lists.list("ROLE_USER"));
			return userAuthenticationDto;
		});

		return Optional.ofNullable(result);
	}

	public UserAuthenticationDto save(UserAuthenticationDto userAuthentication) {
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
}