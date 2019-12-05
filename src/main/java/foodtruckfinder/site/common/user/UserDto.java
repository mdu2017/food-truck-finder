package foodtruckfinder.site.common.user;

import alloy.util.Momento;
import foodtruckfinder.site.common.foodtruck.FoodTruckDto;
import org.codehaus.jackson.annotate.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jlutteringer on 8/23/17.
 */
public class UserDto implements Momento<String> {
	private Long id;
	private List<String> roles;
	private String principal;
	private String username;
	private boolean isOwner;

	private List<FoodTruckDto.FoodType> prefFoodTypes = new ArrayList<FoodTruckDto.FoodType>();
	private double prefDistance = 0.5;
	private double prefHigh = 1000;
	private double prefLow = 0;

	public List<FoodTruckDto.FoodType> getPrefFoodTypes() {
		return prefFoodTypes;
	}

	public void setPrefFoodTypes(List<FoodTruckDto.FoodType> prefFoodTypes) {
		this.prefFoodTypes = prefFoodTypes;
	}

	public double getPrefDistance() {
		return prefDistance;
	}

	public void setPrefDistance(double prefDistance) {
		this.prefDistance = prefDistance;
	}

	public double getPrefHigh() {
		return prefHigh;
	}

	public void setPrefHigh(double prefHigh) {
		this.prefHigh = prefHigh;
	}

	public double getPrefLow() {
		return prefLow;
	}

	public void setPrefLow(double prefLow) {
		this.prefLow = prefLow;
	}

	public Long getId() {
		return id;
	}
	public List<String> getRoles() { return roles; }
	public String getPrincipal() { return principal; }
	public String getUsername() { return this.username; }
	public boolean getIsOwner() { return isOwner; }

	public void setRoles(List<String> roles) { this.roles = roles; }
	public void setId(Long id) { this.id = id;}
	public void setPrincipal(String principal) { this.principal = principal; }
	public void setUsername(String username) { this.username = username; }
	public void setIsOwner(boolean value) { this.isOwner = value; }

	/*What even is this*/
	@JsonIgnore
	@Override
	public String getMomento() {
		return principal;
	}
}