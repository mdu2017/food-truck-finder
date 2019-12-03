package foodtruckfinder.site.common.foodtruck;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.util.*;

import alloy.util.Tuple;
import foodtruckfinder.site.common.External.Rating;
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

				foodTruckDto.setSchedule(getSchedule(Long.valueOf(id)));

				//TODO::truck_image
				//not right now
				foodTruckDto.setTruck_image(null);

				//type
				String typesql = "SELECT FOOD_TYPE.TYPE FROM FOOD_TYPE, FOOD_TRUCK " +
						"WHERE FOOD_TRUCK_ID = :foodTruckId AND FOOD_TRUCK.TYPE = FOOD_TYPE.TYPE_ID";
				String type = jdbcTemplate.query(typesql, parameters, typers -> {
					if (typers.next()) {
						return typers.getString("TYPE");
					} else {
						return FoodTruckDto.FoodType.AMERICAN.name();//default to american food, but guarantee that it will be a valid set
					}
				});
				foodTruckDto.setType(type);

				//Deal
				foodTruckDto.setDeals(getAllDeals(foodTruckDto.getId()));
				return foodTruckDto;
			} else {
				return null;
			}
		});

		return Optional.ofNullable(result);
	}

	/** Find food truck by name */
//	public Optional<FoodTruckDto> findByName(String name) {
//
//		System.out.println("Name in DAO: " + name);
//
//		//Get all food trucks with partial string match
//		String sql = "SELECT * FROM FOOD_TRUCK WHERE LOCATE(:foodTruckName, FOOD_TRUCK.NAME) != 0";
//
//		Map<String, ?> parameters = _Maps.map("foodTruckName", name);
//
//		FoodTruckDto result = jdbcTemplate.query(sql, parameters, rs -> {
//			if (rs.next()) {
//
//				FoodTruckDto foodTruckDto = new FoodTruckDto(); //9 fields to set
//				foodTruckDto.setId(rs.getLong("FOOD_TRUCK_ID"));
//				foodTruckDto.setName(rs.getString("NAME"));
//				foodTruckDto.setPrice_high(rs.getDouble("PRICE_HIGH"));
//				foodTruckDto.setPrice_low(rs.getDouble("PRICE_LOW"));
//				foodTruckDto.setStatus(rs.getString("STATUS"));
//				foodTruckDto.setOwnerId(rs.getLong("OWNER_ID"));
//				foodTruckDto.setDescription(rs.getString("DESCRIPTION"));
//
//				//need to get menu, schedule, truck_image, and type
//				//For menu, get a list
////				String menusql = "SELECT ITEM_ID, NAME, DESCRIPTION, PRICE FROM MENU WHERE TRUCK_ID = :foodTruckId";
////
////				List<Pair<Long, Triple<String, String, Double>>> menu = jdbcTemplate.query(menusql, parameters, (menurs, rowNum) -> {
////					Pair<Long, Triple<String, String, Double>> item = new Tuple2<>(
////							menurs.getLong("ITEM_ID"),
////							new Tuple3<>(
////									menurs.getString("NAME"),
////									menurs.getString("DESCRIPTION"),
////									menurs.getDouble("PRICE"))
////					);
////					return item;
////				});
//
//				//Temporary menu
//				foodTruckDto.setMenu(null);
//
//				//schedule
//				foodTruckDto.setSchedule(getSchedule(foodTruckDto.getId()));
//
//
//				//TODO::truck_image
//				//not right now
//				foodTruckDto.setTruck_image(null);
//
//				//type
//				String typesql = "SELECT FOOD_TYPE.TYPE FROM FOOD_TYPE, FOOD_TRUCK " +
//						"WHERE FOOD_TRUCK.NAME = :foodTruckName AND FOOD_TRUCK.TYPE = FOOD_TYPE.TYPE_ID";
//				String type = jdbcTemplate.query(typesql, parameters, typers -> {
//					if (typers.next()) {
//						return typers.getString("TYPE");
//					} else {
//						return FoodTruckDto.FoodType.AMERICAN.name();//default to american food, but garuntee that it will be a valid set
//					}
//				});
//
//				//Set Type
//				foodTruckDto.setType(type);
//
//				return foodTruckDto;
//			} else {
//				return null;
//			}
//		});
//
//		return Optional.ofNullable(result);
//	}


    //TODO: fixing bug
	public Optional<FoodTruckDto> findByType(int typeID, String type) {

		System.out.println("Type in DAO: " + typeID);

		//Find by type
		String sql = "SELECT * FROM FOOD_TRUCK WHERE :typeID = FOOD_TRUCK.TYPE";

		Map<String, ?> parameters = _Maps.map("typeID", typeID);

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
//				String menusql = "SELECT ITEM_ID, NAME, DESCRIPTION, PRICE FROM MENU WHERE TRUCK_ID = :foodTruckId";
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
				foodTruckDto.setSchedule(getSchedule(foodTruckDto.getId()));


				//TODO::truck_image
				//not right now
				foodTruckDto.setTruck_image(null);

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
            updateSchedule(foodTruck);

			//type stuff
			int typeid = getFoodTypeId(foodTruck.getType());

			//deal stuff
			for(Deal d : foodTruck.getDeals()){
				insertDeal(d);
			}

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

			//Do it!
			jdbcTemplate.update(sql, parameters);
			return foodTruck;
		} else { //new food truck
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
					(foodTruck.getDescription() != null ? ", DESCRIPTION" : " ") +
					") VALUES " +
					"(:owner_id, :name, :type, :price_low, :price_high, :status" +
					(foodTruck.getDescription() != null ? ", :desc" : " ") +
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

			//Insert schedule in database
			updateSchedule(foodTruck);

			//deal stuff
			for(Deal d : foodTruck.getDeals()){
				insertDeal(d);
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

    /**
     * Remove a food truck
     * @param truck_id the id to remove
     * @return success
     */
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
	public Long insertStop(Stop s){
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
	 * Gets the list of subscribers to a particular food truck
	 *
	 * @param foodTruckId the truck to retrieve subscribers for
	 * @return the list of subscribers to a particular food truck
	 */
	public List<String> getSubscribers(Long foodTruckId) {
		String sql = "SELECT USERNAME FROM SUBSCRIPTIONS, USER WHERE " +
				"SUBSCRIPTIONS.USER_ID = USER.USER_ID AND TRUCK_ID = :foodTruckId";

		Map<String, ?> params = _Maps.map("foodTruckId", foodTruckId);
		return jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getString("USERNAME"));
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
			String sql = "SELECT FOOD_TRUCK_ID FROM FOOD_TRUCK WHERE LOCATE(:name, FOOD_TRUCK.NAME) != 0";

			Map<String, ?> params = _Maps.map("name", name);
			List<Long> names = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getLong("FOOD_TRUCK_ID"));

			System.out.println("List of food trucks matching " + name + "\n" + names);

			//If name of food truck found, run findByName
			if (names != null) {
				trucks = new ArrayList<>();
				for (Long ft : names) {
					//get each food truck
					//TODO: need to edit find to search for name instead of ID
					Optional<FoodTruckDto> temp = find(ft + "");//findByName(ft);
					if (temp.isPresent()) {
						trucks.add(temp.get());
					}
				}
			}
		}

		return Optional.ofNullable(trucks);
	}

	public Optional<List<FoodTruckDto>> searchFoodTrucksByType(String type) {

		List<FoodTruckDto> trucks = null;
		String fType = type.toUpperCase();
        System.out.println(fType);

		if (!type.isEmpty() && type != null) {

			String sql = "SELECT * FROM FOOD_TRUCK, " +
                    "(SELECT TYPE_ID FROM FOOD_TYPE WHERE :fType = FOOD_TYPE.TYPE) AS TRUCKTYPE " +
                    "WHERE TRUCKTYPE.TYPE_ID = FOOD_TRUCK.TYPE";
			Map<String, ?> params = _Maps.map("fType", fType);
			List<Integer> truckIDs = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getInt("FOOD_TRUCK_ID"));
			System.out.println(truckIDs);

			//If type is found, get all food trucks with that type
			if (truckIDs != null) {
                    trucks = new ArrayList<>();
                    for (Integer ftID : truckIDs) {
                        //Get each food truck
                        Optional<FoodTruckDto> temp = find(ftID.toString());
                        if (temp.isPresent()) {
                            trucks.add(temp.get());
                        }
                    }

			}
		}

		return Optional.ofNullable(trucks);
	}

    public Optional<List<FoodTruckDto>> searchTrucksByPrice(double maxPrice) {

        List<FoodTruckDto> trucks = null;

        //Get all food trucks with the price range
        if (maxPrice >= 0.0) {
            String sql = "SELECT * FROM FOOD_TRUCK WHERE FOOD_TRUCK.PRICE_HIGH <= :maxPrice";

            Map<String, ?> params = _Maps.map("maxPrice", maxPrice);
            List<Integer> ids = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getInt("FOOD_TRUCK_ID"));

            if (ids != null) {
                trucks = new ArrayList<>();
                for (Integer id : ids) {
                    Optional<FoodTruckDto> temp = find(id.toString());
                    if (temp.isPresent()) {
                        trucks.add(temp.get());
                    }
                }
            }
        }

        return Optional.ofNullable(trucks);
    }

    //TODO: WIP (convert to miles DONE)
    public Optional<List<FoodTruckDto>> searchTrucksByDistance(double userLat, double userLng, double maxDistance){

	    final int COORD_FACTOR = 69;

	    List<FoodTruckDto> trucks = null;
        List<Long> goodTruckIDs = new ArrayList<>();

        String sql = "SELECT * " +
                "FROM SCHEDULE AS sch, TRUCK_STOP AS st " +
                "WHERE sch.STOP_ID = st.STOP_ID " +
                "AND sch.DAY = :day  AND (TIME(st.START) < TIME(NOW())) " +
                "AND (TIME(st.END) > TIME(NOW())) " +
                "AND ((POW(st.LATITUDE - :userLat, 2) + POW(st.LONGITUDE - " +
                ":userLng, 2)) < :maxDistance)";

        Map<String, ?> params = _Maps.map("userLat", userLat,
                "userLng", userLng, "day", "T", "maxDistance", maxDistance);
        List<Long> ids = jdbcTemplate.query(sql, params,
                (rs, rowNum) -> rs.getLong("TRUCK_ID"));

        //Stores all latitudes and longitudes of all trucks
        List<Double> lats = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getDouble("LATITUDE"));
        List<Double> longs = jdbcTemplate.query(sql, params, (rs, rowNum) -> rs.getDouble("LONGITUDE"));

        //Do mile conversion and add to good trucks
        for(int i = 0; i < lats.size(); i++){
            double xDiff = userLat - lats.get(i);
            double yDiff = userLng - longs.get(i);
            double geoDist = Math.sqrt(Math.pow(xDiff, 2.0) + Math.pow(yDiff, 2.0));

            double distInMiles = geoDist * COORD_FACTOR;
            System.out.print("Dist in miles between truck " + ids.get(i) + " is ");
            System.out.format("%.2f\n", distInMiles);

            if(distInMiles <= maxDistance){
                goodTruckIDs.add(ids.get(i));
            }
        }

        //If trucks are within distance, fill info for the DTOs
        if (!goodTruckIDs.isEmpty()) {
            trucks = new ArrayList<>();
            for (Long ft : goodTruckIDs) {
                //get each food truck
                Optional<FoodTruckDto> temp = this.find(ft.toString());
                if (temp.isPresent()) {
                    trucks.add(temp.get());
                }
            }
        }

        return Optional.ofNullable(trucks);
    }


	public Optional<List<FoodTruckDto>> getRecommendations(double userlat,
														   double userlong,
														   double radius) {
		List<FoodTruckDto> trucks = null;

		String sql = "SELECT sch.TRUCK_ID " +
				"FROM SCHEDULE AS sch, TRUCK_STOP AS st " +
				"WHERE sch.STOP_ID = st.STOP_ID " +
				"AND sch.DAY = :day  AND (TIME(st.START) < TIME(NOW())) " +
				"AND (TIME(st.END) > TIME(NOW())) " +
				"AND ((POW(st.LATITUDE - :userlat, 2) + POW(st.LONGITUDE - " +
				":userlong, 2)) < :radius)";

		Map<String, ?> params = _Maps.map("userlat", userlat,
				"userlong", userlong, "day", "T", "radius", radius);
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

    public Optional<List<FoodTruckDto>> getNearby(double userlat,
                                                           double userlong,
                                                           double radiusInMiles) {
        List<FoodTruckDto> trucks = null;

        String sql = "SELECT sch.TRUCK_ID " +
                "FROM SCHEDULE AS sch, TRUCK_STOP AS st " +
                "WHERE sch.STOP_ID = st.STOP_ID " +
                "AND sch.DAY = :day  AND (TIME(st.START) < TIME(NOW())) " +
                "AND (TIME(st.END) > TIME(NOW())) " +
                "AND ((POW(st.LATITUDE - :userlat, 2) + POW(st.LONGITUDE - " +
                ":userlong, 2)) < :radius)";

        Map<String, ?> params = _Maps.map("userlat", userlat,
                "userlong", userlong, "day", "T", "radius", radiusInMiles);
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
				"(:foodTruckId, (SELECT USER_ID FROM USER WHERE USERNAME = :username), :message, NOW())";

		List<String> subscribers = getSubscribers(foodTruckId);
		for (String subscriber : subscribers) {
			sent = LocalDateTime.now();
//			Optional<UserDto> curUser = users.findUserByUsername(subscriber);
//			userID = curUser.get().getId();
			Map<String, ?> params = _Maps.map("foodTruckId", foodTruckId, "username", subscriber, "message", message);//, "sent", Timestamp.valueOf(sent));
			jdbcTemplate.update(sql, params);
		}
	}

	public Deal addDeal(String message, Long truckID, LocalDateTime start, LocalDateTime end){
		Deal d = new Deal();
		d.setStart(start);
		d.setEnd(end);
		d.setMessage(message);
		d.setTruck_id(truckID);

		insertDeal(d);

		return d;
	}

	private Long insertDeal(Deal d){
		if(d != null){
			if(d.getDeal_id() != null){
				String sql = "REPLACE INTO DEAL " +
						"(DEAL_ID, TRUCK_ID, MESSAGE, START, END) VALUES " +
						"(:dealID, :truckID, :message, :startTime, :endTime);";

				Map<String, ?> params = _Maps.map("truckID", d.getTruck_id(),
						"message", d.getMessage(),
						"start", d.getStartSql(),
						"end", d.getEndSql(),
						"dealID", d.getDeal_id());

				jdbcTemplate.update(sql, params);
				return d.getDeal_id();
			} else {
				String sql = "INSERT INTO DEAL " +
						"(TRUCK_ID, MESSAGE, START, END) VALUES " +
						"(:truckID, :message, :startTime, :endTime);";


				Map<String, ?> params = _Maps.map("truckID", d.getTruck_id(),
						"message", d.getMessage(),
						"start", d.getStartSql(),
						"end", d.getEndSql());

				KeyHolder keyHolder = new GeneratedKeyHolder();
				jdbcTemplate.update(sql, new MapSqlParameterSource(params), keyHolder);

				d.setDeal_id(keyHolder.getKey().longValue());
				return keyHolder.getKey().longValue();
			}
		} else {
			return (long) -1;
		}
	}

	public void removeDeal(Long truckID){
		String sql = "DELETE * FROM DEAL WHERE TRUCK_ID = :truckID";
		Map<String, ?> params = _Maps.map("truckID", truckID);
		jdbcTemplate.update(sql, params);
	}

	public Optional<List<Triple<Double, Double, FoodTruckDto>>> viewNearbyTrucks(double userlat, double userlong) {
		/** Grab all nearby food trucks **/
		List<FoodTruckDto> nearbyTrucks = null;

		String nearbySQL = "SELECT sch.TRUCK_ID " +
				"FROM schedule AS sch, truck_stop AS st " +
				"WHERE sch.STOP_ID = st.STOP_ID " +
				"AND sch.DAY = :day  AND (TIME(st.start) < TIME(NOW())) " +
				"AND (TIME(st.end) > TIME(NOW())) " +
				"AND ((POW(st.LATITUDE - :userlat, 2) + POW(st.LONGITUDE - " +
				":userlong, 2)) < 1)";

		Map<String, ?> nearbyParams = _Maps.map("userlat", userlat,
				"userlong", userlong, "day", "T");
		List<Long> ids = jdbcTemplate.query(nearbySQL, nearbyParams,
				(rs, rowNum) -> rs.getLong("TRUCK_ID"));

		if (ids != null) {
			nearbyTrucks = new ArrayList<>();
			for (Long ft : ids) {
				//get each food truck
				Optional<FoodTruckDto> temp = this.find(ft + "");
				if (temp.isPresent()) {
					nearbyTrucks.add(temp.get());
				}
			}
		}

		//Array of locations for all nearby food trucks
		List<Triple<Double, Double, FoodTruckDto>> locations = new ArrayList<>();

		/**For all nearby trucks grab their locations**/
		for(FoodTruckDto nearbyFT : nearbyTrucks){
			long truckid = nearbyFT.getId();

			String sql = "SELECT st.LATITUDE, st.LONGITUDE " +
					"FROM schedule AS sch, truck_stop AS st " +
					"WHERE sch.STOP_ID = st.STOP_ID " +
					"AND sch.TRUCK_ID = :truckid " +
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

			Map<String, ?> params = _Maps.map("day", currDay, "truckid", truckid);
			Optional<Tuple.Triple<Double, Double, FoodTruckDto>> location = jdbcTemplate.query(sql, params, rs -> {
				Triple<Double, Double, FoodTruckDto> loc = null;
				if(rs.next()) {
					loc = new Tuple3<Double, Double, FoodTruckDto>(
							rs.getDouble("LATITUDE"), rs.getDouble("LONGITUDE"), nearbyFT);
					locations.add(loc);
				}
				return Optional.ofNullable(loc);
			});
		}

		return Optional.ofNullable(locations);
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
			temp.setRating(rs.getFloat("RATING"));

			return temp;
		});

		return r;
	}

	private List<Tuple.Pair<String, Stop>> getSchedule(Long ftID){
		Map<String, ?> parameters = _Maps.map("foodTruckId", ftID);
		String schedsql = "SELECT DAY, START, END, LATITUDE, LONGITUDE, TRUCK_STOP.STOP_ID AS STOP_ID FROM TRUCK_STOP, SCHEDULE " +
				"WHERE TRUCK_ID = :foodTruckId AND SCHEDULE.STOP_ID = TRUCK_STOP.STOP_ID";

        return jdbcTemplate.query(schedsql, parameters, (schedrs, rownum) -> {
            Stop s1 = new Stop();
            s1.setStart(schedrs.getTimestamp("START").toLocalDateTime());
            s1.setEnd(schedrs.getTimestamp("END").toLocalDateTime());
            s1.setLat(schedrs.getDouble("LATITUDE"));
            s1.setLog(schedrs.getDouble("LONGITUDE"));
            s1.setId(schedrs.getLong("STOP_ID"));

            String day = schedrs.getString("DAY");
            return new Tuple2<String, Stop>(day, s1);
        });
	}

	private void updateSchedule(FoodTruckDto foodTruck){
		//Need to remove any stops not still present -- do this by removing all tuples associated with the
		// food truck then adding them all back :)
		String deleteSql = "DELETE ts.*, s.* FROM TRUCK_STOP as ts, SCHEDULE as s " +
				"WHERE ts.STOP_ID = s.STOP_ID AND s.TRUCK_ID = :truckid";
		Map<String, ?> deleteparams = _Maps.map("truckid", foodTruck.getId());
		jdbcTemplate.update(deleteSql, deleteparams);

		String schedsql= "INSERT IGNORE INTO SCHEDULE (TRUCK_ID, DAY, STOP_ID) VALUES " +
				"(:foodTruckid, :day, :stopid)";
		List<Tuple.Pair<String, Stop>> schedule = foodTruck.getSchedule();
		if(schedule != null){
			for(Tuple.Pair<String, Stop> s : schedule){//add each item to the database
				//update the stops table
				insertStop(s.getSecond());

				//update the schedule table after the stops table has been updated
				Map<String, ?> schedparams = _Maps.map(
						"foodTruckId", foodTruck.getId(),
						"day", s.getFirst(),
						"stopid", s.getSecond().getId());

				jdbcTemplate.update(schedsql, schedparams);
			}
		}
	}

	public void addEvent(String details, Long stop_ID){
		String sql = "INSERT INTO EVENT (DESCRIPTION, STOP_ID) VALUES (:details, :stop_ID)";
		Map<String, ?> params = _Maps.map("details", details, "stop_ID", stop_ID);
		jdbcTemplate.update(sql, params);
		return;
	}

	public void removeEvent(Long event_ID){
		String sql = "DELETE FROM EVENT WHERE EVENT_ID = :event_ID";
		Map<String, ?> params = _Maps.map("event_ID", event_ID);
		jdbcTemplate.update(sql, params);
	}

	public void signUpForEvent(Long truck_ID, Long event_ID){
		String sql = "INSERT INTO ATTENDING_EVENT (TRUCK_ID, EVENT_ID) VALUES (:truck_ID, :event_ID)";
		Map<String, ?> params = _Maps.map("truck_ID", truck_ID, "event_ID", event_ID);
		jdbcTemplate.update(sql, params);
		return;
	}

	public void cancelEventSignup(Long truck_ID, Long event_ID){
		String sql = "DELETE FROM ATTENDING_EVENT WHERE TRUCK_ID = :truck_ID AND EVENT_ID = :event_ID";
		Map<String, ?> params = _Maps.map("truck_ID", truck_ID, "event_ID", event_ID);
		jdbcTemplate.update(sql, params);
		return;
	}

	public Optional<EventDto> getEventById(Long event_ID){
		String sql = "SELECT * FROM EVENT WHERE EVENT_ID = :event_ID";
		Map<String, ?> params = _Maps.map("event_ID", event_ID);
		jdbcTemplate.query(sql, params, (rs) -> {
			if(rs.next()){
				EventDto temp = new EventDto();
				temp.setEvent_ID(event_ID);
				temp.setDescription(rs.getString("DESCRIPTION"));
				String tempSql = "SELECT * FROM TRUCK_STOP WHERE STOP_ID = :stop_id";
				Map<String, ?> tempParams = _Maps.map("stop_id", rs.getLong("STOP_ID"));
				jdbcTemplate.query(tempSql, tempParams, (resultSet) ->{
					if(resultSet.next()){
						Stop eventStop = new Stop();
						eventStop.setLat(resultSet.getDouble("LATITUDE"));
						eventStop.setLog(resultSet.getDouble("LONGITUDE"));
						eventStop.setStart(resultSet.getTimestamp("START").toLocalDateTime());
						eventStop.setEnd(resultSet.getTimestamp("END").toLocalDateTime());
						eventStop.setId(rs.getLong("STOP_ID"));
						temp.setStop(eventStop);
					}
					else{
						temp.setStop(null);
					}
				});
				return temp;
			}
			else{
				return null;
			}
		});
		return null;
	}

	public Optional<List<Long>> getAttendingTrucks(Long event_ID){
		String sql = "SELECT TRUCK_ID FROM ATTENDING_EVENT WHERE EVENT_ID = :event_ID";
		Map<String, ?> params = _Maps.map("event_ID", event_ID);
		List<Long> ids = new ArrayList<>();
		jdbcTemplate.query(sql, params, (rs) -> {
			if(rs.next()){
				ids.add(rs.getLong("TRUCK_ID"));
			}
		});
		if(ids.size() > 0){
			return Optional.ofNullable(ids);
		}
		else{
			return null;
		}
	}

	public Optional<Deal> getDeal(Long dealID) {
		String sql = "SELECT * FROM DEAL WHERE DEAL_ID = :id";
		Map<String, ?> params = _Maps.map("id", dealID);
		Deal deal = jdbcTemplate.query(sql, params, rs -> {
			if(rs.next()){
				Deal d = new Deal();
				d.setDeal_id(dealID);
				d.setMessage(rs.getString("MESSAGE"));
				d.setTruck_id(rs.getLong("TRUCK_ID"));
				d.setStart(rs.getTimestamp("START").toLocalDateTime());
				d.setEnd(rs.getTimestamp("END").toLocalDateTime());
				return d;
			} else {
				return null;
			}
		});
		return Optional.ofNullable(deal);
	}

	public List<Deal> getAllDeals(Long truckID) {
		String sql = "SELECT DEAL_ID FROM DEAL WHERE TRUCK_ID = :truckid";
		Map<String, ?> params = _Maps.map("truckid", truckID);
		List<Deal> deals = jdbcTemplate.query(sql, params, (rs, rownum) -> getDeal(rs.getLong("DEAL_ID")).get());

		return deals;
	}
}
