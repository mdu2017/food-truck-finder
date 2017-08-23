package petfinder.site.endpoint;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import petfinder.site.common.owner.OwnerDto;
import petfinder.site.common.owner.OwnerService;

/**
 * Created by jlutteringer on 8/23/17.
 */
@RestController
@RequestMapping(value = "/api/owner")
public class OwnerEndpoint {
	@Autowired
	private OwnerService ownerService;

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public OwnerDto findOwner(@PathVariable(name = "id") Long id) {
		return ownerService.findOwner(id).get();
	}
}