package viemp3.be_viemp3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BeViemp3Application {

	public static void main(String[] args) {
		SpringApplication.run(BeViemp3Application.class, args);
	}

}
