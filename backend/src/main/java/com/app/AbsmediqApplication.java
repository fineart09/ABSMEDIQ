package com.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.app") // สแกนทุกอย่างภายใต้ com.app
@EntityScan("com.app.domain")                       // สแกนหา @Entity
@EnableJpaRepositories("com.app.repository")         // สแกนหา Repository
public class AbsmediqApplication {
    public static void main(String[] args) {
        SpringApplication.run(AbsmediqApplication.class, args);
    }
}