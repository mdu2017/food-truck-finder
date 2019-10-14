package foodtruckfinder.site.common.foodtruck;

import java.math.BigInteger;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import alloy.util.Tuple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import alloy.util.Tuple.Triple;
import alloy.util.Tuple.Tuple3;
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

			FoodTruckDto foodTruckDto = new FoodTruckDto(); //9 fields to set
			foodTruckDto.setId(rs.getLong("FOOD_TRUCK_ID"));
			foodTruckDto.setName(rs.getString("NAME"));
			foodTruckDto.setPrice_high(rs.getDouble("PRICE_HIGH"));
			foodTruckDto.setPrice_low(rs.getDouble("PRICE_LOW"));
			foodTruckDto.setStatus(rs.getString("STATUS"));
			//need to get menu, schedule, truck_image, and type
			//For menu, get a list
			String menusql = "SELECT name, description, price FROM MENU WHERE TRUCK_ID = :foodTruckId";

			List<Triple<String, String, Double>> menu = jdbcTemplate.query(menusql, parameters, new RowMapper<Triple<String, String, Double>>(){
				@Override
				public Triple mapRow(ResultSet menurs, int rowNum) throws SQLException {
					Triple<String, String, Double> item = new Tuple3<String, String, Double>(
							menurs.getString("NAME"),
							menurs.getString("DESCRIPTION"),
							menurs.getDouble("PRICE")
					);
					return item;
				}
			});
			foodTruckDto.setMenu(menu);

			//schedule
			String schedsql = "SELECT day, start, end, latitude, longitude FROM truck_stop, schedule " +
					          "WHERE truck_id = :foodTruckId AND schedule.stop_id = truck_stop.stop_id";

			Map<String, Stop> schedule = jdbcTemplate.query(schedsql, parameters, (ResultSet schedrs) -> {
				Map<String,Stop> results = new HashMap<>();
				while (schedrs.next()) {
					Stop s1 = new Stop();
					s1.setStart(schedrs.getTimestamp("START").toLocalDateTime());
					s1.setEnd(schedrs.getTimestamp("END").toLocalDateTime());
					s1.setLat(schedrs.getDouble("LATITUDE"));
					s1.setLog(schedrs.getDouble("LONGITUDE"));
					results.put(schedrs.getString("DAY"), s1);
				}
				return results;
			});
			foodTruckDto.setSchedule(schedule);

			//TODO::truck_image
			//not right now
			foodTruckDto.setTruck_image(null);

			//type
			String typesql = "SELECT type FROM food_type, food_truck " +
							 "WHERE food_truck_id = :foodTruckId AND food_truck.type = type.type_id";
			String type = jdbcTemplate.query(typesql, parameters, typers -> {
				typers.next();
				return typers.getString("type");
			});
			foodTruckDto.setType(type);

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
		if(foodTruck.getId() != null) {//also need todo::schedule
			String sql = "UPDATE FOOD_TRUCK SET " +
					"NAME = :name, " +
					"TYPE = :type, " +
					"PRICE_LOW = :price_low, " +
					"PRICE_HIGH = :price_high, " +
					"STATUS = :status " +
					"WHERE FOOD_TRUCK_ID = :foodTruckId";

//			Map<String, ?> parameters = _Maps.map(
//					"foodTruckId", foodTruck.getId(),
//					"name", foodTruck.getName(),
//					"type", foodTruck.getType().toString());
			Map<String, ?> parameters = _Maps.mapPairs(
					new Tuple.Tuple2<>("foodTruckId", foodTruck.getId()),
					new Tuple.Tuple2<>("name", foodTruck.getName()),
					new Tuple.Tuple2<>("type", foodTruck.getType().toString()),
					new Tuple.Tuple2<>("price_low", foodTruck.getPrice_low()),
					new Tuple.Tuple2<>("price_high", foodTruck.getPrice_high()),
					new Tuple.Tuple2<>("status", foodTruck.getStatus())
			);

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
	public void subscribe(int truck_id, int user_id){ /*todo::do this*/ }
}