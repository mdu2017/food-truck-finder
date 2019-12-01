package foodtruckfinder.site.test.unit;

import foodtruckfinder.site.common.foodtruck.FoodTruckDao;
import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import foodtruckfinder.site.common.foodtruck.Stop;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class FoodTruckTester {
    FoodTruckDto foodTruckDto = new FoodTruckDto();
    FoodTruckDao foodTruckDao = new FoodTruckDao();
    String truckName = "Name of Truck";
    double lowVal = 1.5;
    double highVal = 3.0;
    double delta = 0.001;

    @Test
    public void testTruckName(){
        foodTruckDto.setName(truckName);
        assertEquals(foodTruckDto.getName(), "Name of Truck");
    }

    @Test
    public void testLowPrice(){
        foodTruckDto.setPrice_low(lowVal);
        assertEquals(foodTruckDto.getPrice_low(), 1.5, delta);
    }

    @Test
    public void testHighPrice(){
        foodTruckDto.setPrice_high(highVal);
        assertEquals(foodTruckDto.getPrice_high(), 3.0, delta);
    }

    @Test
    public void testNullStop(){
        Stop testStop = null;
        long fail = foodTruckDao.insertStop(testStop);
        assertEquals(-1, fail);
    }

    @Test
    public void testGetByOwnerNullID(){
        Long badID = null;
        Optional<List<FoodTruckDto>> result = foodTruckDao.getByOwner(badID);
        assertEquals(Optional.empty(), result);
    }

    @Test
    public void testSearchFoodTrucksNullName(){
        String nullName = null;
        Optional<List<FoodTruckDto>> results = foodTruckDao.searchFoodTrucks(nullName);
        assertEquals(Optional.empty(), results);
    }

    @Test
    public void testSearchFoodTrucksEmptyName(){
        String emptyName = "";
        Optional<List<FoodTruckDto>> results = foodTruckDao.searchFoodTrucks(emptyName);
        assertEquals(Optional.empty(), results);
    }

    @Test
    public void testGetRecommendationsNoTrucks(){
        //Initialize data
        FoodTruckDto tester1, tester2, tester3;
        tester1 = new FoodTruckDto();
        tester1.setName(null);
        tester2 = new FoodTruckDto();
        tester2.setName(null);
        tester3 = new FoodTruckDto();
        tester3.setName(null);
        List<FoodTruckDto> ids = new ArrayList<>();
        ids.add(tester1);
        ids.add(tester2);
        ids.add(tester3);
        //Test algorithm
        List<FoodTruckDto> trucks = null;
        if (ids != null) {
            trucks = new ArrayList<>();
            for (FoodTruckDto ft : ids) {
                //get each food truck
                if (ft.getName() != null) {
                    trucks.add(ft);
                }
            }
        }

        assertEquals(0, trucks.size());
    }

    @Test
    public void testGetRecommendationsAllTrucks(){
        //Initialize data
        FoodTruckDto tester1, tester2, tester3;
        tester1 = new FoodTruckDto();
        tester1.setName("Frank");
        tester2 = new FoodTruckDto();
        tester2.setName("Charlie");
        tester3 = new FoodTruckDto();
        tester3.setName("Mac");
        List<FoodTruckDto> ids = new ArrayList<>();
        ids.add(tester1);
        ids.add(tester2);
        ids.add(tester3);
        //Test algorithm
        List<FoodTruckDto> trucks = null;
        if (ids != null) {
            trucks = new ArrayList<>();
            for (FoodTruckDto ft : ids) {
                //get each food truck
                if (ft.getName() != null) {
                    trucks.add(ft);
                }
            }
        }
        assertEquals(3, trucks.size());
    }

    @Test
    public void testGetRecommendationsSomeTrucks(){
        //Initialize data
        FoodTruckDto tester1, tester2, tester3;
        tester1 = new FoodTruckDto();
        tester1.setName("Dennis");
        tester2 = new FoodTruckDto();
        tester2.setName(null);
        tester3 = new FoodTruckDto();
        tester3.setName(null);
        List<FoodTruckDto> ids = new ArrayList<>();
        ids.add(tester1);
        ids.add(tester2);
        ids.add(tester3);
        //Test algorithm
        List<FoodTruckDto> trucks = null;
        if (ids != null) {
            trucks = new ArrayList<>();
            for (FoodTruckDto ft : ids) {
                //get each food truck
                if (ft.getName() != null) {
                    trucks.add(ft);
                }
            }
        }
        assertEquals(1, trucks.size());
    }
}
