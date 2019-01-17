package petfinder.site;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by jlutteringer on 8/22/17.
 */
@Configuration
@EnableWebMvc
public class MvcConfiguration extends WebMvcConfigurerAdapter {
	/**
	 * This configures our application to load files from the classpath when the resource handler is matched.
	 * For example, in the code below we mount /statics/** which means that any url that matches that pattern (such as
	 * localhost:8080/statics/best-cat.jpg) will then be mapped to the same path under the resource location directory
	 * which, in this case, is /resources/statics/**
	 *
	 * This means that if you wish to add additional static media to the application, you can add it under /resources/statics and
	 * it will be automatically served under localhost:8080/statics with the same sub-path.
	 * @param registry
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
				.addResourceHandler("/statics/**")
				.addResourceLocations("classpath:statics/");
	}

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/login").setViewName("login");
	}
}