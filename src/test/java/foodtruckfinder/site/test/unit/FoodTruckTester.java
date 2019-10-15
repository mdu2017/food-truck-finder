package foodtruckfinder.site.test.unit;

import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class FoodTruckTester {
    FoodTruckDto foodTruckDto = new FoodTruckDto();
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
}
