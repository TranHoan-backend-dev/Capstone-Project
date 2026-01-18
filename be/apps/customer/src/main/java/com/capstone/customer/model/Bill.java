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
  String id;
  String customerId;

  @Column(nullable = false)
  String name;
  String note;

  @Column(nullable = false)
  String exportAddress;
  String installtionFormCode;

  public void setCustomerId(String customerId) {
    Objects.requireNonNull(customerId, Constant.ENT_06);
    if (customerId.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_06);
    }
    this.customerId = customerId;
  }

  public void setName(String name) {
    Objects.requireNonNull(name, Constant.ENT_01);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_01);
    }
    this.name = name;
  }

  public void setNote(String note) {
    Objects.requireNonNull(note, Constant.ENT_10);
    if (note.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_10);
    }
    this.note = note;
  }

  public void setExportAddress(String exportAddress) {
    Objects.requireNonNull(exportAddress, Constant.ENT_03);
    if (exportAddress.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_03);
    }
    this.exportAddress = exportAddress;
  }

  public void setInstalltionFormCode(String installtionFormCode) {
    Objects.requireNonNull(installtionFormCode, Constant.ENT_09);
    if (installtionFormCode.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_09);
    }
    this.installtionFormCode = installtionFormCode;
  }

  public static Bill create(@NonNull Consumer<BillBuilder> consumer) {
    var builder = new BillBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class BillBuilder {
    private final Bill bill = new Bill();

    public BillBuilder customerId(String customerId) {
      bill.setCustomerId(customerId);
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
      bill.setInstalltionFormCode(installtionFormCode);
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
