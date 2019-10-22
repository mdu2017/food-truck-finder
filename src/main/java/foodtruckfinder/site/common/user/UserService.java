package foodtruckfinder.site.common.user;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// import javax.jws.soap.SOAPBinding.Use;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import alloy.util._Lists;

/**
 * Services are Spring concepts for classes which manage the application's business logic.
 */
@Service
public class UserService {
	@Autowired
	private UserDao userDao;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public Optional<UserDto> findUserByPrincipal(String principal) {
		return userDao.findUserByPrincipal(principal).map(UserAuthenticationDto::getUser);
	}

	public Optional<UserAuthenticationDto> findUserAuthenticationByPrincipal(String principal) {
		return userDao.findUserByPrincipal(principal);
	}

	public Optional<UserDto> findUserByUsername(String username) {
		return userDao.findUserByUsername(username);
	}

	public static class RegistrationRequest {
		private String principal;
		private String password;
		private String username;
		private boolean owner;
		private Map<String, Object> attributes;

		public String getPrincipal() {
			return principal;
		}

		public void setPrincipal(String principal) {
			this.principal = principal;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public boolean getOwner() {
			return owner;
		}

		public void setOwner(boolean owner) {
			this.owner = owner;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public Map<String, Object> getAttributes() {
			return attributes;
		}

		public void setAttributes(Map<String, Object> attributes) {
			this.attributes = attributes;
		}
	}

	public UserDto register(RegistrationRequest request) {
		UserDto userDto = new UserDto();
		userDto.setPrincipal(request.getPrincipal());
		userDto.setUsername(request.getUsername());
		userDto.setIsOwner(request.getOwner());
		userDto.setRoles(_Lists.list("ROLE_USER"));

		UserAuthenticationDto userAuthenticationDto = new UserAuthenticationDto();
		userAuthenticationDto.setUser(userDto);
		userAuthenticationDto.setPassword(passwordEncoder.encode(request.getPassword()));

		userAuthenticationDto = userDao.save(userAuthenticationDto);
		return userAuthenticationDto.getUser();
	}

	public static class UpdateRequest {
		private String principal;
		private String password;
		private String username;
		private boolean owner;
		private long id;
		private Map<String, Object> attributes;


		public String getPrincipal() {
			return principal;
		}

		public void setPrincipal(String principal) {
			this.principal = principal;
		}

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public boolean getOwner() {
			return owner;
		}

		public void setOwner(boolean owner) {
			this.owner = owner;
		}

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}

		public Map<String, Object> getAttributes() {
			return attributes;
		}

		public void setAttributes(Map<String, Object> attributes) {
			this.attributes = attributes;
		}

		public long getId() {
			return id;
		}

		public void setId(long id) {
			this.id = id;
		}
	}

	public UserDto update(UpdateRequest request) {
		UserDto userDto = new UserDto();
		userDto.setPrincipal(request.getPrincipal());
		userDto.setUsername(request.getUsername());
		userDto.setIsOwner(request.getOwner());
		userDto.setRoles(_Lists.list("ROLE_USER"));
		userDto.setId(request.getId());

		UserAuthenticationDto userAuthenticationDto = new UserAuthenticationDto();
		userAuthenticationDto.setUser(userDto);
		userAuthenticationDto.setPassword(passwordEncoder.encode(request.getPassword()));

		userAuthenticationDto = userDao.save(userAuthenticationDto);

		return userAuthenticationDto.getUser();

	}

	public List<String> getSubscriptions(String id) { return userDao.getSubscriptions(Long.parseLong(id)); }

	public Optional<List<Long>> getOwnedFoodTrucks(Long id) { return userDao.getOwnedFoodTrucks(id); }
}