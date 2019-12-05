package foodtruckfinder.site.test.unit;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import static org.junit.Assert.*;

public class testSubscribedScore {

    @Test
    public void testIsSubscribed(){
        List<Long> subscribedTrucks = new ArrayList<>();
        subscribedTrucks.add(1l);
        subscribedTrucks.add(2l);
        subscribedTrucks.add(3l);

        Long truck_ID = 2l;
        double score;
        if(subscribedTrucks.contains(truck_ID)){
            score = 10.0;
        }
        else{
            score = 5.0;
        }
        assertTrue( score == 10.0);
        return;
    }

    @Test
    public void testNotSubscribed(){
        List<Long> subscribedTrucks = new ArrayList<>();
        subscribedTrucks.add(1l);
        subscribedTrucks.add(2l);
        subscribedTrucks.add(3l);

        Long truck_ID = 7l;
        double score;
        if(subscribedTrucks.contains(truck_ID)){
            score = 10.0;
        }
        else{
            score = 5.0;
        }
        assertTrue( score == 5.0);
        return;
    }
}
