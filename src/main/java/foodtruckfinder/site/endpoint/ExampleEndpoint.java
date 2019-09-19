package foodtruckfinder.site.endpoint;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController

public class ExampleEndpoint {

    private String hello = "unset";

    @RequestMapping(value = "/example/hello-receive", method = RequestMethod.POST)
    @CrossOrigin(origins = "http://localhost:3000")
    public String helloReceive(@RequestBody String request) {
        System.out.println("Received: " + request);
        this.hello = request;
        return request;
    }

}
