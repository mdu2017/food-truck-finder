package foodtruckfinder.site.common.foodtruck;

import alloy.util.Tuple;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class ScheduleFE{
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