package com.capstone.customer.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.utils.Message;

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
  String billId;

  @OneToOne(fetch = FetchType.EAGER)
  @MapsId("billId")
  Customer customer;

  @Column(nullable = false)
  String billName;
  String note;

  @Column(nullable = false)
  String exportAddress;

  public void setBillId(String value) {
    requireNonNullAndNotEmpty(value, Message.ENT_02);
    this.billId = value;
  }

  public void setBillName(String name) {
    requireNonNullAndNotEmpty(name, SharedMessage.MES_05);
    this.billName = name;
  }

  public void setNote(String note) {
    requireNonNullAndNotEmpty(note, SharedMessage.MES_08);
    this.note = note;
  }

  public void setExportAddress(String exportAddress) {
    requireNonNullAndNotEmpty(exportAddress, Message.ENT_01);
    this.exportAddress = exportAddress;
  }

  public void setCustomer(Customer customer) {
    Objects.requireNonNull(customer, Message.ENT_04);
    this.customer = customer;
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
      bill.setBillId(customerId);
      return this;
    }

    public BillBuilder name(String name) {
      bill.setBillName(name);
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

    public BillBuilder customer(Customer customer) {
      bill.setCustomer(customer);
      return this;
    }

    public Bill build() {
      Objects.requireNonNull(bill.billName, SharedMessage.MES_05);
      if (bill.billName.trim().isEmpty()) {
        throw new IllegalArgumentException(SharedMessage.MES_05);
      }
      Objects.requireNonNull(bill.exportAddress, Message.ENT_01);
      if (bill.exportAddress.trim().isEmpty()) {
        throw new IllegalArgumentException(Message.ENT_01);
      }
      return bill;
    }
  }
}
