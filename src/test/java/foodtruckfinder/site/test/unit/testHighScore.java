package foodtruckfinder.site.test.unit;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class testHighScore {

    @Test
    public void testWithinPreference(){
        double result = -1.0;
        double score = -1.0;
        double truckHigh = 8.0;
        double userHigh = 10.0;
        score = truckHigh - userHigh;

        if(score <= 0){
            result = 10.0;
        }
        else if(score <= 5){
            result = (10 - (2*score));
        }
        else{
            result = 0.0;
        }
        assertTrue( result == 10.0);
    }

    @Test
    public void testWithinRange(){
        double result = -1.0;
        double score = -1.0;
        double truckHigh = 12.5;
        double userHigh = 10.0;
        score = truckHigh - userHigh;

        if(score <= 0){
            result = 10.0;
        }
        else if(score <= 5){
            result = (10 - (2*score));
        }
        else{
            result = 0.0;
        }
        assertTrue( result == 5.0);
    }

    @Test
    public void testOutsideBoundaries(){
        double result = -1.0;
        double score = -1.0;
        double truckHigh = 12.0;
        double userHigh = 5.0;
        score = truckHigh - userHigh;

        if(score <= 0){
            result = 10.0;
        }
        else if(score <= 5){
            result = (10 - (2*score));
        }
        else{
            result = 0.0;
        }
        assertTrue( result == 0.0);
    }
}
