package foodtruckfinder.site.security;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import foodtruckfinder.site.common.user.UserAuthenticationDto;
import foodtruckfinder.site.common.user.UserService;

/**
 *
 */
@Service
public class FoodTruckFinderUserDetailsService implements UserDetailsService {
	@Autowired
	private UserService userService;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserAuthenticationDto userAuthentication =
				userService.findUserAuthenticationByPrincipal(username).orElseThrow(() -> new UsernameNotFoundException(username + " not found"));

		return new User(
				userAuthentication.getUser().getPrincipal(),
				userAuthentication.getPassword(),
				userAuthentication.getUser().getRoles().stream()
						.map(SimpleGrantedAuthority::new)
						.collect(Collectors.toList()));
	}
}