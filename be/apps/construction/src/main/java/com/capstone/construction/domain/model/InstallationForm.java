package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

import com.capstone.construction.infrastructure.config.Constant;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstallationForm {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String formCode;

  @Column(length = 36, unique = true)
  String formNumber;

  @Column(nullable = false)
  String customerName;

  String representative;

  String businessPosition;

  @Column(nullable = false)
  String houseNumber;

  @Column(length = 12, unique = true, nullable = false)
  String citizenIdentificationNumber;

  @Column(nullable = false)
  String citizenIdentificationProvideDate;

  @Column(nullable = false)
  String citizenIdentificationProvideLocation;

  @Column(length = 10, nullable = false)
  String phoneNumber;

  String taxCode;

  @Column(nullable = false)
  String bankAccountNumber;

  @Column(nullable = false)
  String bankAccountProviderLocation;

  @Column(nullable = false)
  String usageTarget;

  @Column(nullable = false)
  LocalDateTime receivedFormAt;

  LocalDateTime scheduleSurveyAt;

  @Column(nullable = false)
  Integer numberOfHousehold;

  @Column(nullable = false)
  Integer householdRegistrationNumber;

  // String object;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "road_id")
  Road road;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_supply_network_id")
  WaterSupplyNetwork network;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "unit_id")
  NeighborhoodUnit unit;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "commune_id")
  Commune commune;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "hamlet_id")
  Hamlet hamlet;
  String surveyEmployeeId;

  @Column(nullable = false)
  String overallWaterMeterId;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  public void setFormNumber(String formNumber) {
    requireNonNullAndNotEmpty(formNumber, Constant.PT_44);
    this.formNumber = formNumber;
  }

  public void setCustomerName(String customerName) {
    requireNonNullAndNotEmpty(customerName, Constant.PT_27);
    this.customerName = customerName;
  }

  public void setRepresentative(String representative) {
    requireNonNullAndNotEmpty(representative, Constant.PT_45);
    this.representative = representative;
  }

  public void setBusinessPosition(String businessPosition) {
    requireNonNullAndNotEmpty(businessPosition, Constant.PT_46);
    this.businessPosition = businessPosition;
  }

  public void setHouseNumber(String houseNumber) {
    requireNonNullAndNotEmpty(houseNumber, Constant.PT_47);
    this.houseNumber = houseNumber;
  }

  public void setCitizenIdentificationNumber(String citizenIdentificationNumber) {
    requireNonNullAndNotEmpty(citizenIdentificationNumber, Constant.PT_48);
    this.citizenIdentificationNumber = citizenIdentificationNumber;
  }

  public void setCitizenIdentificationProvideDate(String citizenIdentificationProvideDate) {
    requireNonNullAndNotEmpty(citizenIdentificationProvideDate,
        Constant.PT_49);
    this.citizenIdentificationProvideDate = citizenIdentificationProvideDate;
  }

  public void setCitizenIdentificationProvideLocation(String citizenIdentificationProvideLocation) {
    requireNonNullAndNotEmpty(citizenIdentificationProvideLocation,
        Constant.PT_50);
    this.citizenIdentificationProvideLocation = citizenIdentificationProvideLocation;
  }

  public void setPhoneNumber(String phoneNumber) {
    requireNonNullAndNotEmpty(phoneNumber, Constant.PT_15);
    if (!phoneNumber.matches(Constant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(Constant.PT_14);
    }
    this.phoneNumber = phoneNumber;
  }

  public void setTaxCode(String taxCode) {
    requireNonNullAndNotEmpty(taxCode, Constant.PT_51);
    this.taxCode = taxCode;
  }

  public void setBankAccountNumber(String bankAccountNumber) {
    requireNonNullAndNotEmpty(bankAccountNumber, Constant.PT_52);
    this.bankAccountNumber = bankAccountNumber;
  }

  public void setBankAccountProviderLocation(String bankAccountProviderLocation) {
    requireNonNullAndNotEmpty(bankAccountProviderLocation, Constant.PT_53);
    this.bankAccountProviderLocation = bankAccountProviderLocation;
  }

  public void setUsageTarget(String usageTarget) {
    requireNonNullAndNotEmpty(usageTarget, Constant.PT_54);
    this.usageTarget = usageTarget;
  }

  public void setReceivedFormAt(LocalDateTime receivedFormAt) {
    Objects.requireNonNull(receivedFormAt, Constant.PT_55);
    this.receivedFormAt = receivedFormAt;
  }

  public void setScheduleSurveyAt(LocalDateTime scheduleSurveyAt) {
    Objects.requireNonNull(scheduleSurveyAt, Constant.PT_78);
    this.scheduleSurveyAt = scheduleSurveyAt;
  }

  public void setNumberOfHousehold(Integer numberOfHousehold) {
    Objects.requireNonNull(numberOfHousehold, Constant.PT_56);
    this.numberOfHousehold = numberOfHousehold;
  }

  public void setHouseholdRegistrationNumber(Integer householdRegistrationNumber) {
    Objects.requireNonNull(householdRegistrationNumber, Constant.PT_57);
    this.householdRegistrationNumber = householdRegistrationNumber;
  }

  public void setRoad(Road road) {
    Objects.requireNonNull(road, Constant.PT_58);
    this.road = road;
  }

  public void setNetwork(WaterSupplyNetwork network) {
    Objects.requireNonNull(network, Constant.PT_59);
    this.network = network;
  }

  public void setUnit(NeighborhoodUnit unit) {
    Objects.requireNonNull(unit, Constant.PT_60);
    this.unit = unit;
  }

  public void setCommune(Commune commune) {
    Objects.requireNonNull(commune, Constant.PT_26);
    this.commune = commune;
  }

  public void setHamlet(Hamlet hamlet) {
    Objects.requireNonNull(hamlet, Constant.PT_61);
    this.hamlet = hamlet;
  }

  public void setSurveyEmployeeId(String surveyEmployeeId) {
    this.surveyEmployeeId = surveyEmployeeId;
  }

  public void setOverallWaterMeterId(String overallWaterMeterId) {
    requireNonNullAndNotEmpty(overallWaterMeterId, Constant.PT_62);
    this.overallWaterMeterId = overallWaterMeterId;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static InstallationForm create(Consumer<InstallationFormBuilder> builder) {
    var instance = new InstallationFormBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class InstallationFormBuilder {
    private String formNumber;
    private String customerName;
    private String representative;
    private String businessPosition;
    private String houseNumber;
    private String citizenIdentificationNumber;
    private String citizenIdentificationProvideDate;
    private String citizenIdentificationProvideLocation;
    private String phoneNumber;
    private String taxCode;
    private String bankAccountNumber;
    private String bankAccountProviderLocation;
    private String usageTarget;
    private LocalDateTime receivedFormAt;
    private LocalDateTime scheduleSurveyAt;
    private Integer numberOfHousehold;
    private Integer householdRegistrationNumber;
    private Road road;
    private WaterSupplyNetwork network;
    private NeighborhoodUnit unit;
    private Commune commune;
    private Hamlet hamlet;
    private String surveyEmployeeId;
    private String overallWaterMeterId;

    public InstallationFormBuilder formNumber(String formNumber) {
      this.formNumber = formNumber;
      return this;
    }

    public InstallationFormBuilder customerName(String customerName) {
      this.customerName = customerName;
      return this;
    }

    public InstallationFormBuilder representative(String representative) {
      this.representative = representative;
      return this;
    }

    public InstallationFormBuilder businessPosition(String businessPosition) {
      this.businessPosition = businessPosition;
      return this;
    }

    public InstallationFormBuilder houseNumber(String houseNumber) {
      this.houseNumber = houseNumber;
      return this;
    }

    public InstallationFormBuilder citizenIdentificationNumber(String citizenIdentificationNumber) {
      this.citizenIdentificationNumber = citizenIdentificationNumber;
      return this;
    }

    public InstallationFormBuilder citizenIdentificationProvideDate(String citizenIdentificationProvideDate) {
      this.citizenIdentificationProvideDate = citizenIdentificationProvideDate;
      return this;
    }

    public InstallationFormBuilder citizenIdentificationProvideLocation(String citizenIdentificationProvideLocation) {
      this.citizenIdentificationProvideLocation = citizenIdentificationProvideLocation;
      return this;
    }

    public InstallationFormBuilder phoneNumber(String phoneNumber) {
      this.phoneNumber = phoneNumber;
      return this;
    }

    public InstallationFormBuilder taxCode(String taxCode) {
      this.taxCode = taxCode;
      return this;
    }

    public InstallationFormBuilder bankAccountNumber(String bankAccountNumber) {
      this.bankAccountNumber = bankAccountNumber;
      return this;
    }

    public InstallationFormBuilder bankAccountProviderLocation(String bankAccountProviderLocation) {
      this.bankAccountProviderLocation = bankAccountProviderLocation;
      return this;
    }

    public InstallationFormBuilder usageTarget(String usageTarget) {
      this.usageTarget = usageTarget;
      return this;
    }

    public InstallationFormBuilder receivedFormAt(LocalDateTime receivedFormAt) {
      this.receivedFormAt = receivedFormAt;
      return this;
    }

    public InstallationFormBuilder scheduleSurveyAt(LocalDateTime scheduleSurveyAt) {
      this.scheduleSurveyAt = scheduleSurveyAt;
      return this;
    }

    public InstallationFormBuilder numberOfHousehold(Integer numberOfHousehold) {
      this.numberOfHousehold = numberOfHousehold;
      return this;
    }

    public InstallationFormBuilder householdRegistrationNumber(Integer householdRegistrationNumber) {
      this.householdRegistrationNumber = householdRegistrationNumber;
      return this;
    }

    public InstallationFormBuilder road(Road road) {
      this.road = road;
      return this;
    }

    public InstallationFormBuilder network(WaterSupplyNetwork network) {
      this.network = network;
      return this;
    }

    public InstallationFormBuilder unit(NeighborhoodUnit unit) {
      this.unit = unit;
      return this;
    }

    public InstallationFormBuilder commune(Commune commune) {
      this.commune = commune;
      return this;
    }

    public InstallationFormBuilder hamlet(Hamlet hamlet) {
      this.hamlet = hamlet;
      return this;
    }

    public InstallationFormBuilder surveyEmployeeId(String surveyEmployeeId) {
      this.surveyEmployeeId = surveyEmployeeId;
      return this;
    }

    public InstallationFormBuilder overallWaterMeterId(String overallWaterMeterId) {
      this.overallWaterMeterId = overallWaterMeterId;
      return this;
    }

    public InstallationForm build() {
      var form = new InstallationForm();
      form.setFormNumber(formNumber);
      form.setCustomerName(customerName);
      form.setRepresentative(representative);
      form.setBusinessPosition(businessPosition);
      form.setHouseNumber(houseNumber);
      form.setCitizenIdentificationNumber(citizenIdentificationNumber);
      form.setCitizenIdentificationProvideDate(citizenIdentificationProvideDate);
      form.setCitizenIdentificationProvideLocation(citizenIdentificationProvideLocation);
      form.setPhoneNumber(phoneNumber);
      form.setTaxCode(taxCode);
      form.setBankAccountNumber(bankAccountNumber);
      form.setBankAccountProviderLocation(bankAccountProviderLocation);
      form.setUsageTarget(usageTarget);
      form.setReceivedFormAt(receivedFormAt);
      form.setScheduleSurveyAt(scheduleSurveyAt);
      form.setNumberOfHousehold(numberOfHousehold);
      form.setHouseholdRegistrationNumber(householdRegistrationNumber);
      form.setRoad(road);
      form.setNetwork(network);
      form.setUnit(unit);
      form.setCommune(commune);
      form.setHamlet(hamlet);
      form.setSurveyEmployeeId(surveyEmployeeId);
      form.setOverallWaterMeterId(overallWaterMeterId);
      return form;
    }
  }

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
