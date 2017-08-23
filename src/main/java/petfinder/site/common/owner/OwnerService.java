package petfinder.site.common.owner;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableMultimap;
import com.google.common.collect.Multimap;
import petfinder.site.common.pet.PetDto;
import petfinder.site.common.pet.PetService;
import petfinder.site.common.user.UserDto;
import petfinder.site.common.user.UserService;

/**
 * Created by jlutteringer on 8/23/17.
 */
@Service
public class OwnerService {
	@Autowired
	private UserService userService;

	@Autowired
	private PetService petService;

	private final Multimap<Long, Long> ownerMapping =
			ImmutableMultimap.<Long, Long> builder()
					.put(3L, 1L)
					.put(2L, 2L)
					.put(1L, 3L)
					.put(2L, 4L)
					.put(1L, 5L)
					.build();

	public Optional<OwnerDto> findOwner(Long id) {
		Optional<UserDto> user = userService.findUser(id);
		if(!user.isPresent()) {
			return Optional.empty();
		}

		List<PetDto> pets = ownerMapping.get(user.get().getId()).stream()
				.map(petId -> petService.findPet(petId))
				.flatMap(o -> o.isPresent() ? Stream.of(o.get()) : Stream.empty())
				.collect(Collectors.toList());

		return Optional.of(new OwnerDto(user.get(), pets));
	}
}