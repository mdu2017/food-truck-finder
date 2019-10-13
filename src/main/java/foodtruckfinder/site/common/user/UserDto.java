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
	private String principal;
	private String username;
	private List<String> roles;
	private UserType type;
	private Map<String, Object> attributes;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setPrincipal(String principal) {
		this.principal = principal;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public void setType(UserType type) {
		this.type = type;
	}

	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	public String getPrincipal() {
		return principal;
	}

	public String getUsername() {
		return username;
	}

	public List<String> getRoles() {
		return roles;
	}

	public Map<String, Object> getAttributes() {
		return attributes;
	}

	public UserType getType() {
		return type;
	}

	@JsonIgnore
	@Override
	public String getMomento() {
		return principal;
	}

	public enum UserType {
		OWNER, SITTER
	}
}