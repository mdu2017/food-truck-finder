package petfinder.site.common.user;

/**
 * Created by jlutteringer on 8/23/17.
 */
public class UserDto {
	private Long id;
	private String principal;

	public UserDto(Long id, String principal) {
		this.id = id;
		this.principal = principal;
	}

	public Long getId() {
		return id;
	}

	public String getPrincipal() {
		return principal;
	}
}