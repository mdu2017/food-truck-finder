/**
 * This class stores a notification for a user
 */
package foodtruckfinder.site.common.External;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class Notification {
    private LocalDateTime sent;
    private String message, from;
    private Long truckID;
    private boolean viewed;

    public LocalDateTime getSent() { return sent; }
    public String getMessage() { return message; }
    public String getFrom() { return from; }
    public Long getTruckID() {
        return truckID;
    }
    public boolean isViewed() {
        return viewed;
    }

    public void setViewed(boolean viewed) {
        this.viewed = viewed;
    }
    public void setTruckID(Long truckID) {
        this.truckID = truckID;
    }
    public void setSent(LocalDateTime sent) { this.sent = sent; }
    public Timestamp getSentSql() { return Timestamp.valueOf(sent); }
    public void setMessage(String message) { this.message = message; }
    public void setFrom(String from) { this.from = from; }
}