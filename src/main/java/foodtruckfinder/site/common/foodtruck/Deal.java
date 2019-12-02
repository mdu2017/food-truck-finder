package foodtruckfinder.site.common.foodtruck;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;

public class Deal {
    private Long deal_id;
    private String message;
    private LocalDateTime start, end;
    private Long truck_id;

    public Duration getDuration(){ return Duration.between(this.start, this.end); }

    public Long getDeal_id() { return deal_id; }
    public String getMessage() { return message; }
    public LocalDateTime getStart() { return start; }
    public Timestamp getStartSql(){ return Timestamp.valueOf(start); }
    public LocalDateTime getEnd() { return end; }
    public Timestamp getEndSql(){ return Timestamp.valueOf(end); }
    public Long getTruck_id() { return truck_id; }

    public void setDeal_id(Long deal_id) { this.deal_id = deal_id; }
    public void setMessage(String message) { this.message = message; }
    public void setStart(LocalDateTime start) { this.start = start; }
    public void setEnd(LocalDateTime end) { this.end = end; }
    public void setTruck_id(Long truck_id) { this.truck_id = truck_id; }
}
