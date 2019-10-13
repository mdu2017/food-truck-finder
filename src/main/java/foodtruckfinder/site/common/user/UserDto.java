package foodtruckfinder.site.common.user;

import java.util.List;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonIgnore;

import alloy.util.Momento;

/**
 * Created by jlutteringer on 8/23/17.
 */
public class UserDto implements Momento<String> {
	private Long id;
	private List<String> roles;
	private String principal;
	private String username;
	private boolean isOwner;

	public Long getId() {
		return id;
	}

	public List<String> getRoles() { return roles; }

	public void setRoles(List<String> roles) { this.roles = roles; }

	public void setId(Long id) {
		this.id = id;
	}

	public void setPrincipal(String principal) {
		this.principal = principal;
	}

	public String getPrincipal() {
		return principal;
	}

	public String getUsername() { return username; }

	public void setUsername(String username) { this.username = username; }

	public void setIsOwner(boolean value) { this.isOwner = value; }

	public boolean getIsOwner() { return isOwner; }

	/*What even is this*/
	@JsonIgnore
	@Override
	public String getMomento() {
		return principal;
	}

}