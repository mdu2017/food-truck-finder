package foodtruckfinder.site.common.foodtruck;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;

public class Deal {
    private String message;
    private LocalDateTime start, end;

    public Duration getDuration(){ return Duration.between(this.start, this.end); }

    public String getMessage() { return message; }
    public LocalDateTime getStart() { return start; }
    public Timestamp getStartSql(){ return Timestamp.valueOf(start); }
    public LocalDateTime getEnd() { return end; }
    public Timestamp getEndSql(){ return Timestamp.valueOf(end); }

    public void setMessage(String message) { this.message = message; }
    public void setStart(LocalDateTime start) { this.start = start; }
    public void setEnd(LocalDateTime end) { this.end = end; }
}
