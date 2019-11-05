/**
 * This class stores a notification for a user
 */
package foodtruckfinder.site.common.user;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class Notification {
    private LocalDateTime sent;
    private String message, from;

    public LocalDateTime getSent() { return sent; }
    public String getMessage() { return message; }
    public String getFrom() { return from; }

    public void setSent(LocalDateTime sent) { this.sent = sent; }
    public Timestamp getSentSql() { return Timestamp.valueOf(sent); }
    public void setMessage(String message) { this.message = message; }
    public void setFrom(String from) { this.from = from; }
}
