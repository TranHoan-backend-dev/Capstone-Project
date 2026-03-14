package com.capstone.notification.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@ToString
@Document(collection = "notification")
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
  @Id
  String notificationId;
  String title;
  @Setter
  String link;
  String message;
  Boolean status;
  LocalDateTime createdAt;

  public void setTitle(String title) {
    if (title != null && title.trim().isEmpty()) {
      throw new IllegalArgumentException("Tiêu đề không được để trống");
    }
    this.title = title;
  }

  public void setMessage(String message) {
    if (message == null || message.trim().isEmpty()) {
      throw new IllegalArgumentException("Nội dung thông báo không được để trống");
    }
    this.message = message;
  }

  public void setStatus(Boolean status) {
    if (status == null) {
      throw new IllegalArgumentException("Trạng thái không được để trống");
    }
    this.status = status;
  }

  public void setCreatedAt() {
    this.createdAt = LocalDateTime.now();
  }

  public static @NonNull NotificationBuilder builder() {
    return new NotificationBuilder();
  }

  public static class NotificationBuilder {
    private String title;
    private String link;
    private String message;
    private Boolean status;

    public NotificationBuilder title(String title) {
      this.title = title;
      return this;
    }

    public NotificationBuilder link(String link) {
      this.link = link;
      return this;
    }

    public NotificationBuilder message(String message) {
      this.message = message;
      return this;
    }

    public NotificationBuilder status(Boolean status) {
      this.status = status;
      return this;
    }

    public Notification build() {
      var notification = new Notification();
      notification.setTitle(this.title);
      notification.setLink(this.link);
      notification.setMessage(this.message);
      notification.setStatus(this.status);
      notification.setCreatedAt();
      return notification;
    }
  }
}
