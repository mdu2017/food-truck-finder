package foodtruckfinder.site.common.foodtruck;

import alloy.util.Momento;
import alloy.util.Tuple;

import java.awt.image.BufferedImage;
import java.util.List;
import java.util.Map;

/**
 * Created by jlutteringer on 8/23/17.
 */
public class FoodTruckDto implements Momento<Long> {
	private Long id, ownerId;
	private String name, description;
	private FoodType type;
	private List<Tuple.Pair<Long, Tuple.Triple<String, String, Double>>> menu;
	private BufferedImage truck_image = null;
	private Map<String, Stop> schedule;
	private Double price_low, price_high;
	private FTStatus status;

    //Getters
	public Long getId() { return id; }
	public String getName() { return name; }
	public FoodType getType() { return type; }
	public List<Tuple.Pair<Long, Tuple.Triple<String, String, Double>>> getMenu() { return menu; }
	public BufferedImage getTruck_image() { return truck_image; }
    public Map<String, Stop> getSchedule() { return schedule; }
    public double getPrice_low() { return price_low; }
    public double getPrice_high() { return price_high; }
    public FTStatus getStatus() { return status; }
	public Long getOwnerId() { return ownerId; }
	public String getDescription() { return description; }

	//Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(FoodType type) { this.type = type; }
	public void setType(String type) { this.type = FoodType.valueOf(type.toUpperCase()); }
	public void setMenu(List<Tuple.Pair<Long, Tuple.Triple<String, String, Double>>> menu) { this.menu = menu; }
	public void setTruck_image(BufferedImage truck_image) { this.truck_image = truck_image; }
	public void setSchedule(Map<String, Stop> schedule) { this.schedule = schedule; }
	public void setPrice_low(Double price_low) { this.price_low = price_low; }
	public void setPrice_high(Double price_high) { this.price_high = price_high; }
	public void setStatus(FTStatus status) { this.status = status; }
	public void setStatus(String status){ this.status = FTStatus.valueOf(status.toUpperCase()); }
	public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
	public void setDescription(String description) { this.description = description; }

	@Override
	public String toString() {
		return "FoodTruckDto{" +
				"id=" + id + ", ownerId=" + ownerId + ", name='" + name + '\'' +
				", description='" + description + '\'' + ", type=" + type + ", menu=" + menu +
				", truck_image=" + truck_image + ", schedule=" + schedule + ", price_low=" + price_low +
				", price_high=" + price_high + ", status=" + status + '}';
	}

	@Override
	public Long getMomento() {
		return id;
	}

	public enum FTStatus {
		OPEN, CLOSED, IN_TRANSIT
	}

	/**
	 * This enum will have to stay updated with the database
	 */
	public enum FoodType {
		AMERICAN, BBQ, BREAKFAST, CHINESE, DESERT, HEALTHY,
		INDIAN, MEDITERRANEAN, MEXICAN, PIZZA, SEAFOOD, VEGITARIAN, VEGAN, VIETNAMESE
	}
}
