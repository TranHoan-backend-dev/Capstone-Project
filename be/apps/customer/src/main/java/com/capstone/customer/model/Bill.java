package com.capstone.customer.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import com.capstone.customer.config.Constant;

import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Bill {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "customer_id")
  String id;

  @Column(nullable = false)
  String name;
  String note;

  @Column(nullable = false)
  String exportAddress;
  String installtionFormId;

  public void setId(String value) {
    requireNonNullAndNotEmpty(value, Constant.ENT_06);
    this.id = value;
  }

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.ENT_01);
    this.name = name;
  }

  public void setNote(String note) {
    requireNonNullAndNotEmpty(note, Constant.ENT_10);
    this.note = note;
  }

  public void setExportAddress(String exportAddress) {
    requireNonNullAndNotEmpty(exportAddress, Constant.ENT_03);
    this.exportAddress = exportAddress;
  }

  public void setInstalltionFormId(String installtionFormCode) {
    requireNonNullAndNotEmpty(installtionFormCode, Constant.ENT_09);
    this.installtionFormId = installtionFormCode;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Bill create(@NonNull Consumer<BillBuilder> consumer) {
    var builder = new BillBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class BillBuilder {
    private final Bill bill = new Bill();

    public BillBuilder id(String customerId) {
      bill.setId(customerId);
      return this;
    }

    public BillBuilder name(String name) {
      bill.setName(name);
      return this;
    }

    public BillBuilder note(String note) {
      bill.setNote(note);
      return this;
    }

    public BillBuilder exportAddress(String exportAddress) {
      bill.setExportAddress(exportAddress);
      return this;
    }

    public BillBuilder installtionFormCode(String installtionFormCode) {
      bill.setInstalltionFormId(installtionFormCode);
      return this;
    }

    public Bill build() {
      Objects.requireNonNull(bill.name, Constant.ENT_01);
      if (bill.name.trim().isEmpty()) {
        throw new IllegalArgumentException(Constant.ENT_01);
      }
      Objects.requireNonNull(bill.exportAddress, Constant.ENT_03);
      if (bill.exportAddress.trim().isEmpty()) {
        throw new IllegalArgumentException(Constant.ENT_03);
      }
      return bill;
    }
  }
}
