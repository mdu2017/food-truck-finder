package foodtruckfinder.site.test.unit;

import org.junit.Test;
import static org.junit.Assert.*;

public class testLowScore {

    @Test
    public void testWithinPreference(){
        double result = -1.0;
        double score = -1.0;
        double truckLow = 5.0;
        double userLow = 3.0;
        score = truckLow - userLow;

        if(score >= 0){
            result = 10.0;
        }
        else if(score > -10){
            result = (10 + score);
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
        double truckLow = 3.0;
        double userLow = 8.0;
        score = truckLow - userLow;

        if(score >= 0){
            result = 10.0;
        }
        else if(score > -10){
            result = (10 + score);
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
        double truckLow = 1.0;
        double userLow = 25.0;
        score = truckLow - userLow;

        if(score >= 0){
            result = 10.0;
        }
        else if(score > -10){
            result = (10 + score);
        }
        else{
            result = 0.0;
        }
        assertTrue( result == 0.0);
    }
}
