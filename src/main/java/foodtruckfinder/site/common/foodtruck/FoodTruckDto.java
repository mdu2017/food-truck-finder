package foodtruckfinder.site.common.foodtruck;

import alloy.util.Momento;
import alloy.util.Tuple;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.awt.image.BufferedImage;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jlutteringer on 8/23/17.
 */
public class FoodTruckDto implements Momento<Long> {
	private Long id, ownerId;
	private String name, description;
	private FoodType type;
	private List<MenuItem> menu;
	private BufferedImage truck_image = null;
	private List<Tuple.Pair<String, Stop>> schedule;
	private List<ScheduleFE> schedFE;
	private Double price_low, price_high;
	private FTStatus status;
	private List<Deal> deals;

    //Getters
	public Long getId() { return id; }
	public String getName() { return name; }
	public FoodType getType() { return type; }
	public List<MenuItem> getMenu() { return menu; }
	public BufferedImage getTruck_image() { return truck_image; }
	@JsonIgnore
	public List<Tuple.Pair<String, Stop>> getSchedule() { return schedule; }
    public double getPrice_low() { return price_low; }
    public double getPrice_high() { return price_high; }
    public FTStatus getStatus() { return status; }
	public Long getOwnerId() { return ownerId; }
	public String getDescription() { return description; }
	public List<Deal> getDeals() { return deals; }
	public List<ScheduleFE> getSchedFE() {
		if(schedFE == null) {
			schedFE = new ArrayList<>();
		}
		if(schedFE.size() == 0){
			for (Tuple.Pair<String, Stop> s : schedule) {
				ScheduleFE f = new ScheduleFE();
				f.constructSchedule(s);
				schedFE.add(f);
			}
		}
		return schedFE; }

	//Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(FoodType type) { this.type = type; }
	public void setType(String type) { this.type = FoodType.valueOf(type.toUpperCase()); }
	public void setMenu(List<MenuItem> menu) { this.menu = menu; }
	public void setTruck_image(BufferedImage truck_image) { this.truck_image = truck_image; }
	public void setSchedule(List<Tuple.Pair<String, Stop>> schedule) { this.schedule = schedule; }
	public void setPrice_low(Double price_low) { this.price_low = price_low; }
	public void setPrice_high(Double price_high) { this.price_high = price_high; }
	public void setStatus(FTStatus status) { this.status = status; }
	public void setStatus(String status){ this.status = FTStatus.valueOf(status.toUpperCase()); }
	public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
	public void setDescription(String description) { this.description = description; }
	public void setDeals(List<Deal> deals) { this.deals = deals; }
	public void setSchedFE(List<ScheduleFE> schedFE) { this.schedFE = schedFE; }

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

	public class ScheduleFE{
		private List<Tuple.Pair<String, Stop>> schedule;
		private String day, endTime, startTime;
		private double lat, log;
		private Long id;

		public Tuple.Pair<String, Stop> getSchedule(){
			Stop s = new Stop();

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
			LocalDate date = LocalDate.now();
			LocalDateTime datetimeend = LocalDateTime.of(date, LocalTime.parse(endTime, formatter));
			LocalDateTime datetimestart = LocalDateTime.of(date, LocalTime.parse(startTime, formatter));
			s.setEnd(datetimeend);
			s.setStart(datetimestart);
			s.setId(id);
			s.setLat(lat);
			s.setLog(log);

			return new Tuple.Tuple2<>(day, s);
		}

		public void constructSchedule(Tuple.Pair<String, Stop> sched){
			this.day = sched.getFirst();
			this.lat = sched.getSecond().getLat();
			this.log = sched.getSecond().getLog();
			this.id = sched.getSecond().getId();

			LocalTime s = sched.getSecond().getStartProper().toLocalTime();
			LocalTime e = sched.getSecond().getEndProper().toLocalTime();

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
			this.endTime = formatter.format(e);
			this.startTime = formatter.format(s);
		}

		public String getDay() {
			return day;
		}
		public void setDay(String day) {
			this.day = day;
		}
		public String getEndTime() {
			return endTime;
		}
		public void setEndTime(String endTime) {
			this.endTime = endTime;
		}
		public String getStartTime() {
			return startTime;
		}
		public void setStartTime(String startTime) {
			this.startTime = startTime;
		}
		public double getLat() {
			return lat;
		}
		public void setLat(double lat) {
			this.lat = lat;
		}
		public double getLog() {
			return log;
		}
		public void setLog(double log) {
			this.log = log;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
	}
}
