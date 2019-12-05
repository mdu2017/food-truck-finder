package foodtruckfinder.site.test.unit;

import foodtruckfinder.site.common.user.UserDao;
import foodtruckfinder.site.common.user.UserDto;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;


public class UserTester {
    UserDto userDto = new UserDto();
    UserDao userDao = new UserDao();
    boolean shouldBeTrue = true;
    String username = "This is not a username";
    String principal = "potato@AOL.net";

    @Test
    public void testIsOwner(){
        userDto.setIsOwner(true);
        assertEquals(userDto.getIsOwner(), shouldBeTrue);
    }

    @Test
    public void testUsername(){
        userDto.setUsername(username);
        assertEquals(userDto.getUsername(), "This is not a username");
    }

    @Test
    public void testPassword(){
        userDto.setPrincipal(principal);
        assertEquals(userDto.getPrincipal(), "potato@AOL.net");
    }

    @Test (expected = NullPointerException.class)
    public void testBadPrincipal(){
        assertNull(userDao.findUserByPrincipal(principal));
    }

    @Test(expected = NullPointerException.class)
    public void testBadUsername(){
        assertNull(userDao.findUserByUsername(username));
    }
}
