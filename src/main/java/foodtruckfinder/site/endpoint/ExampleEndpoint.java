package foodtruckfinder.site.endpoint;

import foodtruckfinder.site.common.user.UserDto;
import foodtruckfinder.site.common.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/unsecure")
public class ExampleEndpoint {

    @Autowired
    private UserService unsecureUserService;

    @GetMapping(value = "/user/{username}", produces = "application/json")
    public Optional<UserDto> viewUser(@PathVariable("username") String username) {
        Optional<UserDto> ret = unsecureUserService.findUserByUsername(username);
        System.out.println(ret);
        return ret;
    }

}
