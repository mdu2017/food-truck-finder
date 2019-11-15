package foodtruckfinder.site.common.External;

import java.time.LocalDateTime;

public class Rating {
    private String message;
    private LocalDateTime date;
    private Float rating;
    private Long user_ID;
    private Long truck_ID;

    public String getMessage(){return this.message;}
    public LocalDateTime getDate() {return this.date;}
    public Float getRating() {return this.rating;}
    public Long getUser() {return this.user_ID;}
    public Long getTruck() {return this.truck_ID;}

    public void setMessage(String message){this.message = message;}
    public void setDate(LocalDateTime time){this.date = time;}
    public void setRating(Float rated){this.rating = rated;}
    public void setUser(Long id){this.user_ID = id;}
    public void setTruck(Long id){this.truck_ID = id;}
}
