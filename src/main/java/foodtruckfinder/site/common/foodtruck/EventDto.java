package foodtruckfinder.site.common.foodtruck;

public class EventDto {
    public int event_ID;
    public String description;
    public Stop stop;

    public EventDto(int id, String desc, Stop stop) {
        this.event_ID = id;
        this.description = desc;
        this.stop = stop;
    }

    public int getEvent_ID() {
        return event_ID;
    }

    public void setEvent_ID(int event_ID) {
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
}
