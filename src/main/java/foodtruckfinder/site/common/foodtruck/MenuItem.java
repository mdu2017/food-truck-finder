package foodtruckfinder.site.common.foodtruck;

public class MenuItem {
    private String name, description;
    private double price;
    private Long itemid;

    public MenuItem(){
        name = "";
        description = "";
        price = 0;
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public Long getItemid() { return itemid; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(double price) { this.price = price; }
    public void setItemid(Long itemid) { this.itemid = itemid; }

    public String toString(){
        return "(" + name + " | " + description + " | " + price + ")";
    }
}
