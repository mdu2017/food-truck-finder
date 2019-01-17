package petfinder.site.common.pet;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * If this is your first time looking at Spring Services, check out the detailed explanation in UserService first.
 *
 * This is the service responsible for saving and retrieving pets which are in Elasticsearch.
 */
@Service
public class PetService {
	@Autowired
	private PetDao petDao;

	public Optional<PetDto> findPet(String id) {
		return petDao.findPet(id);
	}

	public void save(PetDto pet) {
		petDao.save(pet);
	}
}