package petfinder.site.common.pet;

import java.util.UUID;

import alloy.util.Identifiable;
import alloy.util.Momento;

/**
 * Created by jlutteringer on 8/23/17.
 */
public class PetDto implements Momento<String> {
	private String id;
	private String name;
	private String type;

	public PetDto() {
		// Randomly generate an id when constructing a pet object.
		this.id = UUID.randomUUID().toString();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String getMomento() {
		return id;
	}
}