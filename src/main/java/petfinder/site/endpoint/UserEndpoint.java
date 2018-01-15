package petfinder.site.endpoint;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import petfinder.site.common.user.UserDto;

/**
 * Created by jlutteringer on 8/23/17.
 */
@RestController
@RequestMapping(value = "/api/user")
public class UserEndpoint {
	@GetMapping(value = "", produces = "application/json")
	public UserDto getUserDetails() {
		// The authenticated user can be fetched using the SecurityContextHolder
		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		return new UserDto(1L, name);
	}
}