package foodtruckfinder.site.test.unit;

import foodtruckfinder.site.common.foodtruck.Stop;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class StopTester {
    Stop stop = new Stop();
    double lat = 66.6;
    double log = 13.00;
    double delta = 0.001;

    @Test
    public void testLatitude(){
        stop.setLat(lat);
        assertEquals(stop.getLat(), 66.6, delta);
    }

    @Test
    public void testLongitude(){
        stop.setLog(log);
        assertEquals(stop.getLog(), 13.00, delta);
    }
}
