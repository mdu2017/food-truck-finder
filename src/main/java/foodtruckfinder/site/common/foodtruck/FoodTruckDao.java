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

	/**
	 * This function returns the first successful match (a food truck object) of the string id to a food truck in the database.
	 *
	 * @param id the id to search for
	 * @return the food truck DTO of the first matching food truck, if any (using conditional object "Optional")
	 */
	public Optional<FoodTruckDto> find(String id) { // == get FT
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

	/**
	 * This function saves a food truck's updates, if any.  If it doesn't have an id associated with it, it adds the
	 * 	food truck to the database
	 * @param foodTruck the food truck to update/add
	 * @return the updated food truck DTO (if added, an id will now be associated with it)
	 */
	public FoodTruckDto save(FoodTruckDto foodTruck) { //== add/update FT
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
			//This needs to check if the food truck DOES exist already in the database (check for duplicate infomation
			//  in any "unique" field
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

	/**
	 * This function subscribes a user to a food truck, checking if the relationship exists first
	 * @param truck_id
	 * @param user_id
	 */
	public void subscribe(int truck_id, int user_id){}
}