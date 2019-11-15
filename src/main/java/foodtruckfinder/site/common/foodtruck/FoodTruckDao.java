package foodtruckfinder.site.common.foodtruck;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
			if (rs.next()) {

				FoodTruckDto foodTruckDto = new FoodTruckDto(); //9 fields to set
				foodTruckDto.setId(rs.getLong("FOOD_TRUCK_ID"));
				foodTruckDto.setName(rs.getString("NAME"));
				foodTruckDto.setPrice_high(rs.getDouble("PRICE_HIGH"));
				foodTruckDto.setPrice_low(rs.getDouble("PRICE_LOW"));
				foodTruckDto.setStatus(rs.getString("STATUS"));
				foodTruckDto.setOwnerId(rs.getLong("OWNER_ID"));
				foodTruckDto.setDescription(rs.getString("DESCRIPTION"));

				//need to get menu, schedule, truck_image, and type
				//For menu, get a list
//				String menusql = "SELECT ITEM_ID, name, description, price FROM MENU WHERE TRUCK_ID = :foodTruckId";
//
//				List<Pair<Long, Triple<String, String, Double>>> menu = jdbcTemplate.query(menusql, parameters, (menurs, rowNum) -> {
//					Pair<Long, Triple<String, String, Double>> item = new Tuple2<>(
//							menurs.getLong("ITEM_ID"),
//							new Tuple3<>(
//									menurs.getString("NAME"),
//									menurs.getString("DESCRIPTION"),
//									menurs.getDouble("PRICE"))
//					);
//					return item;
//				});
//				foodTruckDto.setMenu(menu);

				//schedule
				String schedsql = "SELECT day, start, end, latitude, longitude, truck_stop.stop_id AS stop_id FROM truck_stop, schedule " +
						"WHERE truck_id = :foodTruckId AND schedule.stop_id = truck_stop.stop_id";

				Map<String, List<Stop>> schedule = jdbcTemplate.query(schedsql, parameters, (ResultSet schedrs) -> {
					Map<String, List<Stop>> results = new HashMap<>();
					while (schedrs.next()) {
						Stop s1 = new Stop();
						s1.setStart(schedrs.getTimestamp("START").toLocalDateTime());
						s1.setEnd(schedrs.getTimestamp("END").toLocalDateTime());
						s1.setLat(schedrs.getDouble("LATITUDE"));
						s1.setLog(schedrs.getDouble("LONGITUDE"));
                        s1.setId(schedrs.getLong("STOP_ID"));

						//add it to the list/map
						String day = schedrs.getString("DAY");
						if(results.containsKey(day)){
						    results.get(day).add(s1);
                        } else {
						    List<Stop> l = new ArrayList<>();
						    l.add(s1);
                            results.put(day, l);
                        }
					}
					return results;
				});
				foodTruckDto.setSchedule(schedule);

				//TODO::truck_image
				//not right now
				foodTruckDto.setTruck_image(null);

				//type
				String typesql = "SELECT food_type.type FROM food_type, food_truck " +
						"WHERE food_truck_id = :foodTruckId AND food_truck.type = food_type.type_id";
				String type = jdbcTemplate.query(typesql, parameters, typers -> {
					if (typers.next()) {
						return typers.getString("type");
					} else {
						return FoodTruckDto.FoodType.AMERICAN.name();//default to american food, but garuntee that it will be a valid set
					}
				});
				foodTruckDto.setType(type);

				return foodTruckDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	//TODO: Find food truck by name
	public Optional<FoodTruckDto> findByName(String name) {

		System.out.println("Name in DAO: " + name);

		//Get all food trucks with partial string match
		String sql = "SELECT * FROM FOOD_TRUCK WHERE LOCATE(:foodTruckName, food_truck.NAME) != 0";

		Map<String, ?> parameters = _Maps.map("foodTruckName", name);

		FoodTruckDto result = jdbcTemplate.query(sql, parameters, rs -> {
			if (rs.next()) {

				FoodTruckDto foodTruckDto = new FoodTruckDto(); //9 fields to set
				foodTruckDto.setId(rs.getLong("FOOD_TRUCK_ID"));
				foodTruckDto.setName(rs.getString("NAME"));
				foodTruckDto.setPrice_high(rs.getDouble("PRICE_HIGH"));
				foodTruckDto.setPrice_low(rs.getDouble("PRICE_LOW"));
				foodTruckDto.setStatus(rs.getString("STATUS"));
				foodTruckDto.setOwnerId(rs.getLong("OWNER_ID"));
				foodTruckDto.setDescription(rs.getString("DESCRIPTION"));

				//need to get menu, schedule, truck_image, and type
				//For menu, get a list
				/**
				 * "Default menu" (take down when done)
				long truckID = foodTruckDto.getId();
				String menusql = "SELECT ITEM_ID, name, description, price FROM MENU WHERE TRUCK_ID = :truckID";

				long num = 10;

				//Triple tuple
				Triple<String, String, Double> temp = new Tuple3<>("a", "b", 3.14);

				//Pair tuple
				Pair<Long, Triple<String, String, Double>> item =
						new Tuple2<Long, Triple<String, String, Double>>(num, temp);

				//Menu list
				List<Pair<Long, Triple<String, String, Double>>> menu =
						new ArrayList<>();
				menu.add(item);
				 */

//				String menusql = "SELECT ITEM_ID, name, description, price FROM MENU WHERE TRUCK_ID = :foodTruckId";
//
//				List<Pair<Long, Triple<String, String, Double>>> menu = jdbcTemplate.query(menusql, parameters, (menurs, rowNum) -> {
//					Pair<Long, Triple<String, String, Double>> item = new Tuple2<>(
//							menurs.getLong("ITEM_ID"),
//							new Tuple3<>(
//									menurs.getString("NAME"),
//									menurs.getString("DESCRIPTION"),
//									menurs.getDouble("PRICE"))
//					);
//					return item;
//				});

				//Temporary menu
				foodTruckDto.setMenu(null);

				//schedule
//				String schedsql = "SELECT day, start, end, latitude, longitude FROM truck_stop, schedule " +
//						"WHERE truck_id = :foodTruckId AND schedule.stop_id = truck_stop.stop_id";
//
//				Map<String, Stop> schedule = jdbcTemplate.query(schedsql, parameters, (ResultSet schedrs) -> {
//					Map<String, Stop> results = new HashMap<>();
//					while (schedrs.next()) {
//						Stop s1 = new Stop();
//						s1.setStart(schedrs.getTimestamp("START").toLocalDateTime());
//						s1.setEnd(schedrs.getTimestamp("END").toLocalDateTime());
//						s1.setLat(schedrs.getDouble("LATITUDE"));
//						s1.setLog(schedrs.getDouble("LONGITUDE"));
//						results.put(schedrs.getString("DAY"), s1);
//					}
//					return results;
//				});

				//Temporary schedule
				foodTruckDto.setSchedule(null);

				//TODO::truck_image
				//not right now
				foodTruckDto.setTruck_image(null);

				//type
				String typesql = "SELECT food_type.type FROM food_type, food_truck " +
						"WHERE food_truck.NAME = :foodTruckName AND food_truck.type = food_type.type_id";
				String type = jdbcTemplate.query(typesql, parameters, typers -> {
					if (typers.next()) {
						return typers.getString("type");
					} else {
						return FoodTruckDto.FoodType.AMERICAN.name();//default to american food, but garuntee that it will be a valid set
					}
				});

				//Set Type
				foodTruckDto.setType(type);

				return foodTruckDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	/**
	 * This function saves a food truck's updates, if any.  If it doesn't have an id associated with it, it adds the
	 * food truck to the database
	 *
	 * @param foodTruck the food truck to update/add
	 * @return the updated food truck DTO (if added, an id will now be associated with it)
	 */
	public FoodTruckDto save(FoodTruckDto foodTruck) { //== add/update FT
		if (foodTruck.getId() != null && find(foodTruck.getId() + "").isPresent()) {//also need todo::schedule, image
			//Add the menu to the database
			String menusql = "";
			List<Pair<Long, Triple<String, String, Double>>> menu = foodTruck.getMenu();
			if (menu != null) {
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
			} else if (menu == null) {
//				menusql = "UPDATE MENU SET " +
//						"NAME = tempMenu" +
//						"DESCRIPTION = testDescription " +
//						"PRICE = 2.50 " +
//						"WHERE ITEM_ID = 10 AND TRUCK_ID = 10";
//
//				Map<String, ?> menuparams = _Maps.map(
//						"foodTruckId", foodTruck.getId(),
//						"name", objects.getSecond().getFirst(),
//						"description", objects.getSecond().getSecond(),
//						"price", objects.getSecond().getThird(),
//						"itemID", objects.getFirst());
//
//				jdbcTemplate.query(menusql);
			}

			//Update schedule in database
            //Need to remove any stops not still present -- do this by removing all tuples associated with the
            // food truck then adding them all back :)
            String deleteSql = "DELETE FROM TRUCK_STOP as ts, SCHEDULE as s " +
                    "WHERE ts.stop_id = s.stop_id AND s.truck_id = :truckid";
            Map<String, ?> deleteparams = _Maps.map("truckid", foodTruck.getId());
            jdbcTemplate.update(deleteSql, deleteparams);

			String schedsql;
			Map<String, List<Stop>> schedule = foodTruck.getSchedule();
			if(schedule != null){
				String[] keys = foodTruck.getSchedule().keySet().toArray(new String[0]);
				for (String key : keys) {//todo:: check if stop exists before adding
					//add each item to the database
					schedsql = "INSERT IGNORE INTO SCHEDULE (TRUCK_ID, DAY, STOP_ID) VALUES " +
							"(:foodTruckid, :day, :stopid )";

					for(Stop s : schedule.get(key)){
						//update the stops table
						insertStop(s);

						//update the schedule table after the stops table has been updated
						Map<String, ?> schedparams = _Maps.map(
								"foodTruckId", foodTruck.getId(),
								"day", key,
								"stopid", s.getId());

						jdbcTemplate.update(schedsql, schedparams);
					}
				}
			}

			//type stuff
			int typeid = getFoodTypeId(foodTruck.getType());

			//overall update in database
			String sql = "UPDATE FOOD_TRUCK SET " +
					"NAME = :name, " +
					"TYPE = :type, " +
					"PRICE_LOW = :price_low, " +
					"PRICE_HIGH = :price_high, " +
					"STATUS = :status" +
					(foodTruck.getDescription() != null ? ", DESCRIPTION = :desc " : " ") +
					"WHERE FOOD_TRUCK_ID = :foodTruckId";

			Map<String, ?> parameters;
			if (foodTruck.getDescription() != null) {
				parameters = _Maps.mapPairs(
						new Tuple.Tuple2<>("foodTruckId", foodTruck.getId()),
						new Tuple.Tuple2<>("name", foodTruck.getName()),
						new Tuple.Tuple2<>("type", typeid),
						new Tuple.Tuple2<>("price_low", foodTruck.getPrice_low()),
						new Tuple.Tuple2<>("price_high", foodTruck.getPrice_high()),
						new Tuple.Tuple2<>("status", foodTruck.getStatus().name()),
						new Tuple.Tuple2<>("desc", foodTruck.getDescription())
				);
			} else {
				parameters = _Maps.mapPairs(
						new Tuple.Tuple2<>("foodTruckId", foodTruck.getId()),
						new Tuple.Tuple2<>("name", foodTruck.getName()),
						new Tuple.Tuple2<>("type", typeid),
						new Tuple.Tuple2<>("price_low", foodTruck.getPrice_low()),
						new Tuple.Tuple2<>("price_high", foodTruck.getPrice_high()),
						new Tuple.Tuple2<>("status", foodTruck.getStatus().name())
				);
			}


			jdbcTemplate.update(sql, parameters);
			return foodTruck;
		} else {
			//todo:: check if the owner exists
			//Add the menu to the database
			String menusql;
			// TODO: Implement Menu in front end
//			List<Pair<Long, Triple<String, String, Double>>> menu = foodTruck.getMenu();
//			for(int i=0; i < menu.size(); i++) {
//				//add each item to the database
//				menusql = "INSERT INTO  MENU " +
//						"(TRUCK_ID, NAME, DESCRIPTION, PRICE) VALUES " +
//						"(:foodTruckId, :name, :description, :price) ";
//
//				Map<String, ?> menuparams = _Maps.map(
//						"foodTruckId", foodTruck.getId(),
//						"name", menu.get(i).getSecond().getFirst(),
//						"description", menu.get(i).getSecond().getSecond(),
//						"price", menu.get(i).getSecond().getThird());
//				KeyHolder menuKeyHolder = new GeneratedKeyHolder();
//
//				jdbcTemplate.update(menusql, new MapSqlParameterSource(menuparams), menuKeyHolder);
//				Pair<Long, Triple<String, String, Double>> item =
//				menu.set(i, new Tuple2<>(menuKeyHolder.getKey().longValue(),
//						  				 menu.get(i).getSecond()));
//			}


			//type
			int typeid = getFoodTypeId(foodTruck.getType());

			//overall insert food truck
			String sql = "INSERT INTO FOOD_TRUCK " +
					"(OWNER_ID, NAME, TYPE, PRICE_LOW, PRICE_HIGH, STATUS" +
					(foodTruck.getDescription() != null ? ", DESCRIPTION" : "") +
					") VALUES " +
					"(:owner_id, :name, :type, :price_low, :price_high, :status" +
					(foodTruck.getDescription() != null ? ", :desc" : "") +
					")";

			Map<String, ?> parameters;
			if (foodTruck.getDescription() != null) {
				parameters = _Maps.mapPairs(
						new Tuple.Tuple2<>("owner_id", foodTruck.getOwnerId()),
						new Tuple.Tuple2<>("name", foodTruck.getName()),
						new Tuple.Tuple2<>("type", typeid),
						new Tuple.Tuple2<>("price_low", foodTruck.getPrice_low()),
						new Tuple.Tuple2<>("price_high", foodTruck.getPrice_high()),
						new Tuple.Tuple2<>("status", foodTruck.getStatus().name()),
						new Tuple.Tuple2<>("desc", foodTruck.getDescription())
				);
			} else {
				parameters = _Maps.mapPairs(
						new Tuple.Tuple2<>("owner_id", foodTruck.getOwnerId()),
						new Tuple.Tuple2<>("name", foodTruck.getName()),
						new Tuple.Tuple2<>("type", typeid),
						new Tuple.Tuple2<>("price_low", foodTruck.getPrice_low()),
						new Tuple.Tuple2<>("price_high", foodTruck.getPrice_high()),
						new Tuple.Tuple2<>("status", foodTruck.getStatus().name())
				);
			}

			KeyHolder keyHolder = new GeneratedKeyHolder();
			jdbcTemplate.update(sql, new MapSqlParameterSource(parameters), keyHolder);
			foodTruck.setId(keyHolder.getKey().longValue());

			// TODO: Implement Schedule in front end
			//Insert schedule in database
			String schedsql = "INSERT INTO SCHEDULE " +
					"(TRUCK_ID, DAY, STOP_ID) VALUES " +
					"(:foodTruckId, :day, :stopid)";
			Map<String, List<Stop>> schedule = foodTruck.getSchedule();
			if(schedule != null){
				String[] keys = foodTruck.getSchedule().keySet().toArray(new String[0]);
				for (String key : keys) {
					//Add each stop to the database
					for(Stop s : schedule.get(key)){
						Long stopid = insertStop(s);

						//add each item to the database
						Map<String, ?> schedparams = _Maps.map(
								"foodTruckId", foodTruck.getId(),
								"day", key,
								"stopid", stopid);

						jdbcTemplate.update(schedsql, new MapSqlParameterSource(schedparams));
					}
				}
			}
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

	public boolean remove(Long truck_id){
		try {
			String sql = "DELETE FROM FOOD_TRUCK WHERE FOOD_TRUCK_ID = :truck_id";
			Map<String, ?> params = _Maps.map("truck_id", truck_id);
			jdbcTemplate.update(sql, params);
			return true;
		} catch(Exception e) {
			return false;
		}
	}

	/**
	 * Gets the food type id from the database or else defaults to american food
	 *
	 * @param type the FoodType to fetch from the database
	 * @return the integer representation in the database of the food type
	 */
	private int getFoodTypeId(FoodTruckDto.FoodType type) {
		//get food type id from database
		String typesql = "SELECT TYPE_ID FROM FOOD_TYPE WHERE TYPE = :type";

		Map<String, ?> typeparams = _Maps.map("type", type.name());

		int typeid = jdbcTemplate.query(typesql, typeparams, typers -> {
			if (typers.next()) {
				return typers.getInt("TYPE_ID");
			} else {
				return 0;//default american food
			}
		});

		return typeid;
	}

	/**
	 * This functions is a utility function for internal use only.  It inserts a stop into the database
	 * <p>
	 * Assumes the stop doesn't exist and inserts it as such
	 *
	 * @param s the stop to insert
	 * @return The stop's ID as set in the database
	 */
	private Long insertStop(Stop s){
		if(s != null){
		    if(s.getId() != null){
                String sql = "REPLACE INTO TRUCK_STOP " +
                        "(STOP_ID, START, END, LATITUDE, LONGITUDE) VALUES " +
                        "(:stopid, :start, :end, :lat, :long)";

                Map<String, ?> params = _Maps.map(
                        "stopid", s.getId(),
                        "start", s.getStartSql(),
                        "stop", s.getEndSql(),
                        "lat", s.getLat(),
                        "long", s.getLog());

                jdbcTemplate.update(sql, new MapSqlParameterSource(params));
                return s.getId();
            } else {
                String sql = "INSERT INTO TRUCK_STOP " +
                        "(START, END, LATITUDE, LONGITUDE) VALUES " +
                        "(:start, :end, :lat, :long)";

                Map<String, ?> params = _Maps.map(
                        "start", s.getStartSql(),
                        "end", s.getEndSql(),
                        "lat", s.getLat(),
                        "long", s.getLog());

                KeyHolder keyHolder = new GeneratedKeyHolder();
                jdbcTemplate.update(sql, new MapSqlParameterSource(params), keyHolder);

                s.setId(keyHolder.getKey().longValue());
                return keyHolder.getKey().longValue();
            }

		} else {
			return (long) -1;
		}
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

	/**
	 * Gets the list of subscribers to a particular food truck
	 *
	 * @param foodTruckId the truck to retrieve subscribers for
	 * @return the list of subscribers to a particular food truck
	 */
	public List<String> getSubscribers(Long foodTruckId) {
		String sql = "SELECT username FROM SUBSCRIPTIONS, USER WHERE " +
				"SUBSCRIPTIONS.USER_ID = USER.USER_ID AND TRUCK_ID = :foodTruckId";

		Map<String, ?> params = _Maps.map("foodTruckId", foodTruckId);
		return jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("username"));
	}

	/**
	 * This functions returns a list of food trucks owned by the given owner
	 *
	 * @param owner_id the owner id
	 * @return a list of food trucks owned by the given owner
	 */
	public Optional<List<FoodTruckDto>> getByOwner(Long owner_id) {
		List<FoodTruckDto> trucks = null;
		if (owner_id != null) {
			String sql = "SELECT FOOD_TRUCK_ID FROM FOOD_TRUCK WHERE " +
					"OWNER_ID = :owner_id";

			Map<String, ?> params = _Maps.map("owner_id", owner_id);
			List<Long> ids = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getLong("FOOD_TRUCK_ID"));

			if (ids != null) {
				trucks = new ArrayList<>();
				for (Long ft : ids) {
					//get each food truck
					Optional<FoodTruckDto> temp = this.find(ft + "");
					if (temp.isPresent()) {
						trucks.add(temp.get());
					}
				}
			}
		}

		return Optional.ofNullable(trucks);
	}

	//TODO: WIP

	/**
	 * Searches for food trucks by name in the database
	 *
	 * @param name the name to search for
	 * @return List of food trucks available by name
	 */
	public Optional<List<FoodTruckDto>> searchFoodTrucks(String name) {

		List<FoodTruckDto> trucks = null;
		if (name != null && !name.isEmpty()) {

			//Partial string match
			String sql = "SELECT NAME FROM FOOD_TRUCK WHERE LOCATE(:name, food_truck.NAME) != 0";

			Map<String, ?> params = _Maps.map("name", name);
			List<String> names = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("NAME"));

			System.out.println("List of food trucks matching " + name + "\n" + names);

			//If name of food truck found, run findByName
			if (names != null) {
				trucks = new ArrayList<>();
				for (String ft : names) {
					//get each food truck
					//TODO: need to edit find to search for name instead of ID
					Optional<FoodTruckDto> temp = findByName(ft);
					if (temp.isPresent()) {
						trucks.add(temp.get());
					}
				}
			}
		}

		System.out.print("Truck list should be: ");
		System.out.println(trucks);

		return Optional.ofNullable(trucks);
	}


	public Optional<List<FoodTruckDto>> getRecommendations(double userlat,
														   double userlong) {
		List<FoodTruckDto> trucks = null;

		String sql = "SELECT sch.TRUCK_ID " +
				"FROM schedule AS sch, truck_stop AS st " +
				"WHERE sch.STOP_ID = st.STOP_ID " +
				"AND sch.DAY = :day  AND (TIME(st.start) < TIME(NOW())) " +
				"AND (TIME(st.end) > TIME(NOW())) " +
				"AND ((POW(st.LATITUDE - :userlat, 2) + POW(st.LONGITUDE - " +
				":userlong, 2)) < 1)";

		Map<String, ?> params = _Maps.map("userlat", userlat,
				"userlong", userlong, "day", "T");
		List<Long> ids = jdbcTemplate.query(sql, params,
				(rs, rowNum) -> rs.getLong("TRUCK_ID"));

		if (ids != null) {
			trucks = new ArrayList<>();
			for (Long ft : ids) {
				//get each food truck
				Optional<FoodTruckDto> temp = this.find(ft + "");
				if (temp.isPresent()) {
					trucks.add(temp.get());
				}
			}
		}

		return Optional.ofNullable(trucks);
	}

	public void sendNotification(String message, Long foodTruckId) {
		LocalDateTime sent;
		Long userID;
		String sql = "INSERT INTO NOTIFICATION " +
				"(TRUCK_ID, USER_ID, MESSAGE, SENT) VALUES " +
				"(:foodTruckId, (SELECT User_ID FROM User WHERE username = :username), :message, NOW())";

		List<String> subscribers = getSubscribers(foodTruckId);
		for (String subscriber : subscribers) {
			sent = LocalDateTime.now();
//			Optional<UserDto> curUser = users.findUserByUsername(subscriber);
//			userID = curUser.get().getId();
			Map<String, ?> params = _Maps.map("foodTruckId", foodTruckId, "username", subscriber, "message", message);//, "sent", Timestamp.valueOf(sent));
			jdbcTemplate.update(sql, params);
		}
	}

	public void addDeal(String message, Long truckID, LocalDateTime start, LocalDateTime end){
		Timestamp startTime = Timestamp.valueOf(start);
		Timestamp endTime = Timestamp.valueOf(end);
		String sql = "INSERT INTO DEAL " +
				"(TRUCK_ID, MESSAGE, START, END) VALUES " +
				"(:truckID, :message, :startTime, :endTime);";
		Map<String, ?> params = _Maps.map("truckID", truckID, "message", message, "start", startTime, "end", endTime);

		jdbcTemplate.update(sql, params);
	}

	public void removeDeal(Long truckID){
		String sql = "DELETE * FROM DEAL WHERE TRUCK_ID = :truckID";
		Map<String, ?> params = _Maps.map("truckID", truckID);
		jdbcTemplate.update(sql, params);
	}


	public Optional<Pair<Double, Double>> getCurrentLocation(Long foodTruckId) {
		String sql = "SELECT st.LATITUDE, st.LONGITUDE " +
				"FROM schedule AS sch, truck_stop AS st " +
				"WHERE sch.STOP_ID = st.STOP_ID " +
				"AND sch.TRUCK_ID = :truckid" +
				"AND sch.DAY = :day  AND (TIME(st.start) < TIME(NOW())) " +
				"AND (TIME(st.end) > TIME(NOW()))";

		String currDay = "U";
		Calendar calendar = Calendar.getInstance();
		switch(Calendar.DAY_OF_WEEK){
			case 1: currDay = "U"; break;
			case 2: currDay = "M"; break;
			case 3: currDay = "T"; break;
			case 4: currDay = "W"; break;
			case 5: currDay = "H"; break;
			case 6: currDay = "F"; break;
			case 7: currDay = "S"; break;
		}

		Map<String, ?> params = _Maps.map("day", currDay, "truckid", foodTruckId);
		Optional<Tuple.Pair<Double, Double>> location = jdbcTemplate.query(sql, params, rs -> {
			Pair<Double, Double> loc = null;
			if(rs.next()) {
				loc = new Tuple2<Double, Double>(rs.getDouble("LATITUDE"), rs.getDouble("LONGITUDE"));
			}
			return Optional.ofNullable(loc);
		});

		return location;
	}

}
