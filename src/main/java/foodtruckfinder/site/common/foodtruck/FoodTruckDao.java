package foodtruckfinder.site.common.foodtruck;

import java.math.BigInteger;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import alloy.util._Maps;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Repository
public class FoodTruckDao {
	@Autowired
	private NamedParameterJdbcTemplate jdbcTemplate;

	public Optional<FoodTruckDto> find(String id) {
		String sql = "SELECT * FROM FOOD_TRUCK WHERE FOOD_TRUCK_ID = :foodTruckId";
		Map<String, ?> parameters = _Maps.map("foodTruckId", id);

		FoodTruckDto result = jdbcTemplate.query(sql, parameters, rs -> {
			rs.next();

			FoodTruckDto foodTruckDto = new FoodTruckDto();
			foodTruckDto.setId(rs.getLong("FOOD_TRUCK_ID"));
			foodTruckDto.setName(rs.getString("NAME"));
			foodTruckDto.setType(rs.getString("TYPE"));
			return foodTruckDto;
		});

		return Optional.ofNullable(result);
	}

	public FoodTruckDto save(FoodTruckDto foodTruck) {
		if(foodTruck.getId() != null) {
			String sql = "UPDATE FOOD_TRUCK SET " +
					"NAME = :name, " +
					"TYPE = :type " +
					"WHERE FOOD_TRUCK_ID = :foodTruckId";

			Map<String, ?> parameters = _Maps.map(
					"foodTruckId", foodTruck.getId(),
					"name", foodTruck.getName(),
					"type", foodTruck.getType());

			jdbcTemplate.update(sql, parameters);
			return foodTruck;
		}
		else {
			String sql = "INSERT INTO FOOD_TRUCK (NAME, TYPE) VALUES (:name, :type)";

			Map<String, ?> parameters = _Maps.map(
					"name", foodTruck.getName(),
					"type", foodTruck.getType());

			KeyHolder keyHolder = new GeneratedKeyHolder();

			jdbcTemplate.update(sql, new MapSqlParameterSource(parameters), keyHolder);

			BigInteger key = (BigInteger) keyHolder.getKey();
			foodTruck.setId(key.longValue());
			return foodTruck;
		}
	}
}