package foodtruckfinder.site.common.External;

public class scoreComparator implements Comparable< scoreComparator > {
    private double score;
    private Long id;

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public int compareTo(scoreComparator o) {
        if(this.getScore() < o.getScore()){
            return -1;
        }
        else if(this.getScore() > o.getScore()){
            return 1;
        }
        else{
            return 0;
        }
    }
}
