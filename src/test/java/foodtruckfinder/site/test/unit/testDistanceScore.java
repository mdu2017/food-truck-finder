package foodtruckfinder.site.test.unit;

import org.junit.Test;
import static org.junit.Assert.*;

public class testDistanceScore {
    @Test
    public void testWithinPreference(){
        double actualDistance = 0.5;
        double prefDistance = 1.1;
        double score = -1.0;
        double diff = (actualDistance - prefDistance);
        if(diff <= 0){
            score = 10;
        }
        else if(diff < 2){
            score = (10.0 - (5.0 * diff));
        }
        else{
            score = 0;
        }
        assertTrue( score == 10.0);
    }

    @Test
    public void testWithinRange(){
        double actualDistance = 2.0;
        double prefDistance = 1.0;
        double score = -1.0;
        double diff = (actualDistance - prefDistance);
        if(diff <= 0){
            score = 10;
        }
        else if(diff < 2){
            score = (10.0 - (5.0 * diff));
        }
        else{
            score = 0;
        }
        assertTrue( score == 5.0);
    }

    @Test
    public void testOutsideBounds(){
        double actualDistance = 5.0;
        double prefDistance = 1.1;
        double score = -1.0;
        double diff = (actualDistance - prefDistance);
        if(diff <= 0){
            score = 10;
        }
        else if(diff < 2){
            score = (10.0 - (5.0 * diff));
        }
        else{
            score = 0;
        }
        assertTrue( score == 0.0);
    }
}
