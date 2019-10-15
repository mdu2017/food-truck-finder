package foodtruckfinder.site.test.unit;

import foodtruckfinder.site.common.user.UserDto;
import org.junit.Test;

import static org.junit.Assert.assertEquals;


public class UserTester {
    UserDto userDto = new UserDto();
    boolean shouldBeTrue = true;
    String username = "Username";
    String principal = "potato@AOL.net";

    @Test
    public void testIsOwner(){
        userDto.setIsOwner(true);
        assertEquals(userDto.getIsOwner(), shouldBeTrue);
    }

    @Test
    public void testUsername(){
        userDto.setUsername(username);
        assertEquals(userDto.getUsername(), "Username");
    }

    @Test
    public void testPassword(){
        userDto.setPrincipal(principal);
        assertEquals(userDto.getPrincipal(), "potato@AOL.net");
    }
}
