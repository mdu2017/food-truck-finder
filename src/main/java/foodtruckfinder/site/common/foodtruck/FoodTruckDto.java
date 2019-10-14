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
	private Long id;
	private String name;
	private FoodType type;
	private List<Tuple.Triple<String, String, Double>> menu;
	private BufferedImage truck_image = null;
	private Map<String, Stop> schedule;
	private Double price_low, price_high;
	private FTStatus status;

    //Getters
	public Long getId() { return id; }
	public String getName() { return name; }
	public FoodType getType() { return type; }
	public List<Tuple.Triple<String, String, Double>> getMenu() { return menu; }
	public BufferedImage getTruck_image() { return truck_image; }
    public Map<String, Stop> getSchedule() { return schedule; }
    public Double getPrice_low() { return price_low; }
    public Double getPrice_high() { return price_high; }
    public FTStatus getStatus() { return status; }

    //Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(FoodType type) { this.type = type; }
	public void setType(String type) { this.type = FoodType.valueOf(type); }
	public void setMenu(List<Tuple.Triple<String, String, Double>> menu) { this.menu = menu; }
	public void setTruck_image(BufferedImage truck_image) { this.truck_image = truck_image; }
	public void setSchedule(Map<String, Stop> schedule) { this.schedule = schedule; }
	public void setPrice_low(Double price_low) { this.price_low = price_low; }
	public void setPrice_high(Double price_high) { this.price_high = price_high; }
	public void setStatus(FTStatus status) { this.status = status; }
	public void setStatus(String status){ this.status = FTStatus.valueOf(status); }

	@Override
	public Long getMomento() {
		return id;
	}

	public enum FTStatus {
		OPEN, CLOSED, IN_TRANSIT
	}

	public enum FoodType {
		AMERICAN, BBQ, BREAKFAST, CHINESE, DESERT, HEALTHY,
		INDIAN, MEDITERRANEAN, PIZZA, SEAFOOD, VEGITARIAN, VEGAN, VIETNAMESE
	}
}
