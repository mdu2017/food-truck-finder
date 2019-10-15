package foodtruckfinder.site.common.foodtruck;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Created by Ethan D on 10/13/19
 */
public class Stop {
    private LocalDateTime start, end;
    private double log, lat;
    private Long id;

    public Duration getDuration(){ return Duration.between(this.start, this.end); }

    //setters
    public void setStart(LocalDateTime start) { this.start = start; }
    public void setEnd(LocalDateTime end) { this.end = end; }
    public void setLog(double log) { this.log = log; }
    public void setLat(double lat) { this.lat = lat; }
    public void setId(Long id) { this.id = id; }

    //getters
    public LocalDateTime getStart() { return start; }
    public Timestamp getStartSql() { return Timestamp.valueOf(start); }
    public LocalDateTime getEnd() { return end; }
    public Timestamp getEndSql() { return Timestamp.valueOf(end); }
    public double getLog() { return log; }
    public double getLat() { return lat; }
    public Long getId() { return id; }
}
