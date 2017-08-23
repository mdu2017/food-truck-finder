package petfinder.site.common.pet;

import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.google.common.collect.ImmutableMap;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Repository
public class PetDao {
	private final Map<Long, PetDto> pets =
			ImmutableMap.<Long, PetDto> builder()
					.put(1L, new PetDto(1L, "Louisa", "cat"))
					.put(2L, new PetDto(2L, "Rover", "dog"))
					.put(3L, new PetDto(3L, "Chairman Meow", "cat"))
					.put(4L, new PetDto(4L, "Ferry", "ferret"))
					.put(5L, new PetDto(5L, "Dogbert", "dog"))
					.build();

	public Optional<PetDto> findPet(Long id) {
		return Optional.ofNullable(pets.get(id));
	}
}