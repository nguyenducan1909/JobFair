package com.nda.jobfair;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.nda")
@EnableJpaRepositories(basePackages = "com.nda.repo")
@EntityScan(basePackages = "com.nda.pojo")
public class JobFairApplication {
    public static void main(String[] args) {
        SpringApplication.run(JobFairApplication.class, args);
    }
}
