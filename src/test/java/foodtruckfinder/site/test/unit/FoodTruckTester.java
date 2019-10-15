package foodtruckfinder.site.test.unit;

import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class FoodTruckTester {
    FoodTruckDto foodTruckDto = new FoodTruckDto();
    String truckName = "Name of Truck";
    double lowVal = 1.5;
    double highVal = 3.0;

    @Test
    public void testTruckName(){
        foodTruckDto.setName(truckName);
        assertEquals(foodTruckDto.getName(), "Name of Truck");
    }

    @Test
    public void testLowPrice(){
        foodTruckDto.setPrice_low(lowVal);
        assertEquals(java.util.Optional.ofNullable(foodTruckDto.getPrice_low()), 1.5);
    }

    @Test
    public void testHighPrice(){
        foodTruckDto.setPrice_high(highVal);
        assertEquals(java.util.Optional.ofNullable(foodTruckDto.getPrice_high()), 3.0);
    }
}
