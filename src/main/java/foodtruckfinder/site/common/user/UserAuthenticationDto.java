package foodtruckfinder.site.common.user;

import alloy.util.Momento;
import org.codehaus.jackson.annotate.JsonIgnore;

/**
 * Created by jlutteringer on 1/15/18.
 */
public class UserAuthenticationDto implements Momento<String> {
	private UserDto user;
	private String password;

	public void setUser(UserDto user) { this.user = user; }
	public void setPassword(String password) { this.password = password; }

	public UserDto getUser() { return user; }
	public String getPassword() { return password; }

	@JsonIgnore
	@Override
	public String getMomento() { return user.getMomento(); }
}