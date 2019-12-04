package foodtruckfinder.site.common.foodtruck;

import java.util.Map;

public class EventDto {
    private Long event_ID;
    //public Map<Long, String> attendingFTs;
    private String description, name;
    private Stop stop;

    public EventDto(){
        this.event_ID = 0l;
        this.description = "";
        this.stop = new Stop();
    }

    public EventDto(long id, String desc, Stop stop) {
        this.event_ID = id;
        this.description = desc;
        this.stop = stop;
    }

    public long getEvent_ID() {
        return event_ID;
    }

    public void setEvent_ID(long event_ID) {
        this.event_ID = event_ID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Stop getStop() {
        return stop;
    }

    public void setStop(Stop stop) {
        this.stop = stop;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }
}
