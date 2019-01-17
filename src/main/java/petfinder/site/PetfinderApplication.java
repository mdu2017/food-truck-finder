package petfinder.site;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This is the entry point to the Spring Application. It directs Spring to scan the classpath and wire up all of the
 * components to be managed by Spring - this includes all of our @Controller and @Service annotated classes. For these
 * objects, Spring manages their lifecycle and we do not directly instantiate them. Usually, these objects are Singletons,
 * ie. there is only one instance present in the running application. When used in this manner Spring replaces the Singleton and
 * Factory design patterns that you might use in a typical Java application sans Spring.
 *
 * It is appropriate to think of this as the logical "main" method to our application, even though it is just calling into Spring and
 * not actually invoking any of our buisness-specific code.
 */
@SpringBootApplication
public class PetfinderApplication {
	public static void main(String[] args) {
		SpringApplication.run(PetfinderApplication.class, args);
	}
}