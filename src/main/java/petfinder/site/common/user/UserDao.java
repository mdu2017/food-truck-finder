package petfinder.site.common.user;

import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.google.common.collect.ImmutableMap;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Repository
public class UserDao {
	private final Map<Long, UserDto> users =
			ImmutableMap.<Long, UserDto> builder()
					.put(1L, new UserDto(1L, "John"))
					.put(2L, new UserDto(2L, "Bob"))
					.put(3L, new UserDto(3L, "Sarah"))
					.put(4L, new UserDto(4L, "Rachel"))
					.put(5L, new UserDto(5L, "Steve"))
					.build();

	public Optional<UserDto> findUser(Long id) {
		return Optional.ofNullable(users.get(id));
	}
}