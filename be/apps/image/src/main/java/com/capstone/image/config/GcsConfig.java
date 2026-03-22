package com.capstone.image.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
public class GcsConfig {
  @Value("${gcs.credentials}")
  private String credentialsPath;

  private final ResourceLoader resourceLoader;

  @Bean
  public Storage storage(GoogleCredentials gcsCredentials) {
    return StorageOptions.newBuilder()
      .setCredentials(gcsCredentials)
      .build()
      .getService();
  }

  @Bean
  public GoogleCredentials gcsCredentials() throws IOException {
    var resource = resourceLoader.getResource("classpath:" + credentialsPath);
    try (var inputStream = resource.getInputStream()) {
      return GoogleCredentials.fromStream(inputStream);
    }
  }
}
