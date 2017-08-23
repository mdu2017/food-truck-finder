package petfinder.site.common.user;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Service
public class UserService {
	@Autowired
	private UserDao userDao;

	public Optional<UserDto> findUser(Long id) {
		return userDao.findUser(id);
	}
}