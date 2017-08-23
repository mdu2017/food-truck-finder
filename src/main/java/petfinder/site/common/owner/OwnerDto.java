package petfinder.site.common.owner;

import java.util.List;

import petfinder.site.common.pet.PetDto;
import petfinder.site.common.user.UserDto;

/**
 * Created by jlutteringer on 8/23/17.
 */
public class OwnerDto {
	private UserDto user;
	private List<PetDto> pets;

	public OwnerDto(UserDto user, List<PetDto> pets) {
		this.user = user;
		this.pets = pets;
	}

	public UserDto getUser() {
		return user;
	}

	public void setUser(UserDto user) {
		this.user = user;
	}

	public List<PetDto> getPets() {
		return pets;
	}

	public void setPets(List<PetDto> pets) {
		this.pets = pets;
	}
}