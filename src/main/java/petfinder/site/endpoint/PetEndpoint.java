package petfinder.site.endpoint;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import petfinder.site.common.pet.PetDto;
import petfinder.site.common.pet.PetService;
import petfinder.site.common.user.UserDto;

/**
 * If this is your first time looking through this project, see the more in-depth overview of controllers in UserEndpoint.
 */
@RestController
@RequestMapping("/api/pets")
public class PetEndpoint {
	// PetService contains our business logic for dealing with pets as well as saving/reading them
	@Autowired
	private PetService petService;

	// Take an id, and look up the corresponding pet
	@GetMapping(value = "/{id}", produces = "application/json")
	public Optional<PetDto> getPet(@PathVariable("id") String id) {
		return petService.findPet(id);
	}

	// Take a JSON representation of a Pet and save it to Elasticsearch
	@PostMapping(produces = "application/json")
	public PetDto savePet(@RequestBody PetDto pet) {
		petService.save(pet);
		return pet;
	}
}