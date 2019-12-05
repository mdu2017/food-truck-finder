package foodtruckfinder.site.rdms;

import liquibase.integration.spring.SpringLiquibase;
import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfiguration {
	@Value("${database.url}")
	private String url;

	@Value("${database.driverClassName}")
	private String driverClassName;

	@Value("${database.initialSize}")
	private int initialSize;

	@Value("${database.maxActive}")
	private int maxActive;

	@Value("${database.minIdle}")
	private int minIdle;

	@Value("${database.maxIdle}")
	private int maxIdle;

	@Value("${database.maxWait}")
	private int maxWait;

	@Value("${database.testWhileIdle}")
	private boolean testWhileIdle;

	@Value("${database.testOnBorrow}")
	private boolean testOnBorrow;

	@Value("${database.testOnReturn}")
	private boolean testOnReturn;

	@Value("${database.timeBetweenEvictionRuns}")
	private int timeBetweenEvictionRuns;

	@Value("${database.minEvictableIdleTime}")
	private int minEvictableIdleTime;

	@Value("${database.removeAbandoned}")
	private boolean removeAbandoned;

	@Value("${database.removeAbandonedTimeout}")
	private int removeAbandonedTimeout;

	@Value("${database.logAbandoned}")
	private boolean logAbandoned;

	@Primary
	@Bean(name = "webDs")
	public DataSource webDs() {
		return buildDataSource();
	}

	@Primary
	@Bean(name = "webJdbcTemplate")
	public JdbcTemplate webJdbcTemplate() {
		return new JdbcTemplate(webDs());
	}

	@Primary
	@Bean(name = "webNamedParameterJdbcTemplate")
	public NamedParameterJdbcTemplate webNamedParameterJdbcTemplate() {
		return new NamedParameterJdbcTemplate(webJdbcTemplate());
	}

	@Bean
	public SpringLiquibase liquibase(DataSource dataSource) {
		SpringLiquibase liquibase = new SpringLiquibase();
		liquibase.setDataSource(dataSource);
		liquibase.setChangeLog("classpath:liquibase/main-changelog.xml");
		return liquibase;
	}

	public DataSource buildDataSource() {
		BasicDataSource dataSource = new BasicDataSource();
		dataSource.setUrl(url);
		dataSource.setDriverClassName(driverClassName);

		dataSource.setInitialSize(initialSize);
		dataSource.setMaxActive(maxActive);
		dataSource.setMinIdle(minIdle);
		dataSource.setMaxIdle(maxIdle);
		dataSource.setMaxWait(maxWait);

		dataSource.setTestWhileIdle(testWhileIdle);
		dataSource.setTestOnBorrow(testOnBorrow);
		dataSource.setTestOnReturn(testOnReturn);
		dataSource.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRuns);
		dataSource.setMinEvictableIdleTimeMillis(minEvictableIdleTime);

		dataSource.setRemoveAbandoned(removeAbandoned);
		dataSource.setRemoveAbandonedTimeout(removeAbandonedTimeout);
		dataSource.setLogAbandoned(logAbandoned);

		return dataSource;
	}
}