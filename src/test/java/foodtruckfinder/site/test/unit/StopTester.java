package foodtruckfinder.site.test.unit;

import foodtruckfinder.site.common.foodtruck.Stop;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class StopTester {
    Stop stop = new Stop();
    double lat = 66.6;
    double log = 13.00;

    @Test
    public void testLatitude(){
        stop.setLat(lat);
        assertEquals(stop.getLat(), 66.6);
    }

    @Test
    public void testLongitude(){
        stop.setLog(log);
        assertEquals(stop.getLog(), 13.00);
    }
}
