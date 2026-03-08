package com.capstone.image.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
public class GcsConfig {
  @Value("${gcs.credentials}")
  private String credentials;

  @Bean
  public Storage storage(GoogleCredentials gcsCredentials) {
    return StorageOptions.newBuilder()
      .setCredentials(gcsCredentials)
      .build()
      .getService();
  }

  @Bean
  public GoogleCredentials gcsCredentials() throws IOException {
    var resource = new ClassPathResource(credentials);

    try (var inputStream = resource.getInputStream()) {
      return GoogleCredentials.fromStream(inputStream);
    }
  }

}
