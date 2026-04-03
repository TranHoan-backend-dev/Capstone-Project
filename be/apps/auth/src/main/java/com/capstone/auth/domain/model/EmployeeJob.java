package com.capstone.auth.domain.model;

import com.capstone.auth.domain.model.utils.EmployeeJobId;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.utils.SharedMessage;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.util.Objects;
import java.util.function.Consumer;

@Getter
@Table
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeJob {
  @EmbeddedId
  EmployeeJobId id;

  @ManyToOne(fetch = FetchType.EAGER)
  @MapsId("empId")
  Users users;

  public void setId(EmployeeJobId id) {
    Objects.requireNonNull(id, SharedMessage.MES_07);
    this.id = id;
  }

  public void setUsers(Users users) {
    Objects.requireNonNull(users, Message.PT_02);
    this.users = users;
  }

  public static EmployeeJob create(@NonNull Consumer<EmployeeJobBuilder> consumer) {
    var builder = new EmployeeJobBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class EmployeeJobBuilder {
    private final EmployeeJob unit = new EmployeeJob();

    public EmployeeJobBuilder id(EmployeeJobId id) {
      unit.setId(id);
      return this;
    }

    public EmployeeJobBuilder users(Users users) {
      unit.setUsers(users);
      return this;
    }

    public EmployeeJob build() {
      return unit;
    }
  }
}
