package foodtruckfinder.site.common.foodtruck;

import java.sql.ResultSet;
import java.util.*;

import alloy.util.Tuple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import alloy.util.Tuple.Pair;
import alloy.util.Tuple.Triple;
import alloy.util.Tuple.Tuple2;
import alloy.util.Tuple.Tuple3;
import alloy.util._Maps;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Repository
public class FoodTruckDao {
	@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
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
			foodTruckDto.setOwnerId(rs.getLong("OWNER_ID"));

			//need to get menu, schedule, truck_image, and type
			//For menu, get a list
			String menusql = "SELECT ITEM_ID, name, description, price FROM MENU WHERE TRUCK_ID = :foodTruckId";

			List<Pair<Long, Triple<String, String, Double>>> menu = jdbcTemplate.query(menusql, parameters, (menurs, rowNum) -> {
				Pair<Long, Triple<String, String, Double>> item = new Tuple2<>(
						menurs.getLong("ITEM_ID"),
						new Tuple3<>(
						menurs.getString("NAME"),
						menurs.getString("DESCRIPTION"),
						menurs.getDouble("PRICE"))
				);
				return item;
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
		if(foodTruck.getId() != null && find(foodTruck.getId() + "").isPresent()) {//also need todo::schedule, image
			//Add the menu to the database
			String menusql = "";
			List<Pair<Long, Triple<String, String, Double>>> menu = foodTruck.getMenu();
			if(menu != null){
                for (Pair<Long, Triple<String, String, Double>> objects : menu) {
                    //add each item to the database
                    menusql = "UPDATE MENU SET " +
                            "NAME = :name" +
                            "DESCRIPTION = :description " +
                            "PRICE = :price " +
                            "WHERE ITEM_ID = :itemID AND TRUCK_ID = :foodTruckId";

                    Map<String, ?> menuparams = _Maps.map(
                            "foodTruckId", foodTruck.getId(),
                            "name", objects.getSecond().getFirst(),
                            "description", objects.getSecond().getSecond(),
                            "price", objects.getSecond().getThird(),
                            "itemID", objects.getFirst());

                    jdbcTemplate.update(menusql, menuparams);
                }
            }

			//Update schedule in database
			String schedsql;
			Map<String, Stop> schedule = foodTruck.getSchedule();
			String[] keys = foodTruck.getSchedule().keySet().toArray(new String[0]);
            for (String key : keys) {
                //add each item to the database
                schedsql = "UPDATE SCHEDULE SET " +
                        "STOP_ID = :stopid " +
                        "WHERE TRUCK_ID = :foodTruckid AND DAY = :day";

                Map<String, ?> schedparams = _Maps.map(
                        "foodTruckId", foodTruck.getId(),
                        "day", key,
                        "stopid", schedule.get(key).getId());

                jdbcTemplate.update(schedsql, schedparams);

                //update the stops table
                String stopsql = "UPDATE TRUCK_STOP SET " +
                        "START = :start, " +
                        "END = :end, " +
                        "LATITUDE = :lat, " +
                        "LONGITUDE = :long " +
                        "WHERE STOP_ID = :stopid";
                Map<String, ?> stopparams = _Maps.map(
                        "start", schedule.get(key).getStartSql(),
                        "end", schedule.get(key).getEndSql(),
                        "lat", schedule.get(key).getLat(),
                        "long", schedule.get(key).getLog(),
                        "stopid", schedule.get(key).getId());

                jdbcTemplate.update(stopsql, stopparams);
            }


			String sql = "UPDATE FOOD_TRUCK SET " +
					"NAME = :name, " +
					"TYPE = :type, " +
					"PRICE_LOW = :price_low, " +
					"PRICE_HIGH = :price_high, " +
					"STATUS = :status " +
					"WHERE FOOD_TRUCK_ID = :foodTruckId";

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
			//Add the menu to the database
			String menusql;
			List<Pair<Long, Triple<String, String, Double>>> menu = foodTruck.getMenu();
			for(int i=0;i<menu.size();i++){
				//add each item to the database
				menusql = "INSERT INTO  MENU " +
						"(TRUCK_ID, NAME, DESCRIPTION, PRICE) VALUES " +
						"(:foodTruckId, :name, :description, :price) ";

				Map<String, ?> menuparams = _Maps.map(
						"foodTruckId", foodTruck.getId(),
						"name", menu.get(i).getSecond().getFirst(),
						"description", menu.get(i).getSecond().getSecond(),
						"price", menu.get(i).getSecond().getThird());
				KeyHolder menuKeyHolder = new GeneratedKeyHolder();

				jdbcTemplate.update(menusql, new MapSqlParameterSource(menuparams), menuKeyHolder);
				Pair<Long, Triple<String, String, Double>> item =
				menu.set(i, new Tuple2<>(menuKeyHolder.getKey().longValue(),
						  				 menu.get(i).getSecond()));
			}

			//Insert schedule in database
			String schedsql;
			Map<String, Stop> schedule = foodTruck.getSchedule();
			String[] keys = foodTruck.getSchedule().keySet().toArray(new String[0]);
            for (String key : keys) {
                //Add each stop to the database
                Long stopid = insertStop(schedule.get(key));

                //add each item to the database
                schedsql = "INSERT INTO SCHEDULE " +
                        "(TRUCK_ID, DAY, STOP_ID) VALUES " +
                        "(:foodTruckid, :day, :stopid)";

                Map<String, ?> schedparams = _Maps.map(
                        "foodTruckId", foodTruck.getId(),
                        "day", key,
                        "stopid", stopid);

                jdbcTemplate.update(schedsql, new MapSqlParameterSource(schedparams));
            }


			String sql = "INSERT INTO FOOD_TRUCK " +
					"(OWNER_ID, NAME, TYPE, PRICE_LOW, PRICE_HIGH, STATUS) VALUES " +
					"(:owner_id, :name, :type, :price_low, :price_high, :status)";

			Map<String, ?> parameters = _Maps.mapPairs(
					new Tuple.Tuple2<>("owner_id", foodTruck.getOwnerId()),
					new Tuple.Tuple2<>("name", foodTruck.getName()),
					new Tuple.Tuple2<>("type", foodTruck.getType().toString()),
					new Tuple.Tuple2<>("price_low", foodTruck.getPrice_low()),
					new Tuple.Tuple2<>("price_high", foodTruck.getPrice_high()),
					new Tuple.Tuple2<>("status", foodTruck.getStatus())
			);
			KeyHolder keyHolder = new GeneratedKeyHolder();
			jdbcTemplate.update(sql, new MapSqlParameterSource(parameters), keyHolder);
			foodTruck.setId(keyHolder.getKey().longValue());

//			String sql = "INSERT INTO FOOD_TRUCK (NAME, TYPE) VALUES (:name, :type)";
//
//			Map<String, ?> parameters = _Maps.map(
//					"name", foodTruck.getName(),
//					"type", foodTruck.getType());
//
//			KeyHolder keyHolder = new GeneratedKeyHolder();
//
//			jdbcTemplate.update(sql, new MapSqlParameterSource(parameters), keyHolder);
//
//			BigInteger key = (BigInteger) keyHolder.getKey();
//			foodTruck.setId(key.longValue());
			return foodTruck;
		}
	}

	/**
	 * This functions is a utility function for internal use only.  It inserts a stop into the database
	 *
	 * Assumes the stop doesn't exist and inserts it as such
	 * @param s the stop to insert
	 * @return The stop's ID as set in the database
	 */
	private Long insertStop(Stop s){
		String sql = "INSERT INTO TRUCK_STOP " +
				"(START, END, LATITUDE, LONGITUDE) VALUES " +
				"(:start, :end, :lat, :long)";

		Map<String, ?> params = _Maps.map(
				"start", s.getStartSql(),
				"stop", s.getEndSql(),
				"lat", s.getLat(),
				"long", s.getLog());

		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(sql, new MapSqlParameterSource(params), keyHolder);

		s.setId(keyHolder.getKey().longValue());
		return keyHolder.getKey().longValue();
	}

	/**
	 * This function subscribes a user to a food truck, checking if the relationship exists first
	 * 	This is achieved with "Insert ignore", which checks if the tuple exists before inserting it
	 * @param truck_id the truck id
	 * @param user_id the user id
	 */
	public void subscribe(Long truck_id, Long user_id){ /*todo::do this*/
		String sql = "INSERT IGNORE INTO SUBSCRIPTIONS " +
				"(TRUCK_ID, USER_ID) VALUES (truck_id, user_id)";

		Map<String, ?> params = _Maps.map("truck_id", truck_id, "user_id", user_id);
		jdbcTemplate.update(sql, params);
	}

	/**
	 * Gets the list of subscribers to a particular food truck
	 * @param truck_id the truck to retrieve subscribers for
	 * @return the list of subscribers to a particular food truck
	 */
	public List<String> getSubscribers(Long truck_id){
		//todo:: fix because username isn't necessarily unique
		String sql = "SELECT username FROM SUBSCRIPTIONS, USER WHERE " +
				"SUBSCRIPTIONS.USER_ID = USER.USER_ID AND TRUCK_ID = :truck_id";

		Map<String, ?> params = _Maps.map("truck_id", truck_id);
		return jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("user_id"));
	}

	/**
	 * This functions returns a list of food trucks owned by the given owner
	 * @param owner_id the owner id
	 * @return a list of food trucks owned by the given owner
	 */
	public Optional<List<FoodTruckDto>> getByOwner(Long owner_id) {
		List<FoodTruckDto> trucks = null;
		if(owner_id != null){
			String sql = "SELECT FOOD_TRUCK_ID FROM FOOD_TRUCK WHERE " +
					"OWNER_ID = :owner_id";

			Map<String, ?> params = _Maps.map("owner_id", owner_id);
			List<Long> ids = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getLong("FOOD_TRUCK_ID"));

			if(ids != null){
				trucks = new ArrayList<>();
				for(Long ft : ids){
					//get each food truck
					Optional<FoodTruckDto> temp = this.find(ft + "");
					if(!temp.isPresent()){
						trucks.add(temp.get());
					}
				}
			}
		}

		return Optional.ofNullable(trucks);
	}
}