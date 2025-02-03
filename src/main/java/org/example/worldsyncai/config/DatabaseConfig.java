package org.example.worldsyncai.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.impl.SecretManagerService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseConfig {

    private final SecretManagerService secretManagerService;

    @Bean
    public DataSource dataSource() {
        String dbName = secretManagerService.getDatabaseName();
        String dbInstance = secretManagerService.getDatabaseInstance();
        String dbUser = secretManagerService.getDatabaseUser();
        String dbPassword = secretManagerService.getDatabasePassword();

        if (dbName == null || dbName.isBlank()) {
            throw new IllegalStateException("❌ Error: DB_NAME is empty or not found!");
        }
        if (dbInstance == null || dbInstance.isBlank()) {
            throw new IllegalStateException("❌ Error: DB_INSTANCE is empty or not found!");
        }

        String dbUrl = String.format(
                "jdbc:postgresql:///%s?cloudSqlInstance=%s&socketFactory=com.google.cloud.sql.postgres.SocketFactory",
                dbName, dbInstance
        );

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(dbUrl);
        hikariConfig.setUsername(dbUser);
        hikariConfig.setPassword(dbPassword);
        hikariConfig.setMaximumPoolSize(10);
        hikariConfig.setDriverClassName("org.postgresql.Driver");

        log.info("✅ DataSource configured successfully!");

        return new HikariDataSource(hikariConfig);
    }
}