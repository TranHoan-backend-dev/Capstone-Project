package com.capstone.auth.application.business.users;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.pages.BusinessPageService;
import com.capstone.auth.application.dto.request.users.FilterUsersRequest;
import com.capstone.auth.application.dto.request.users.UpdateRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.infrastructure.persistence.*;
import com.capstone.common.enumerate.RoleName;
import com.capstone.common.exception.NotExistingException;
import com.capstone.auth.domain.model.EmployeeJob;
import com.capstone.auth.domain.model.Profile;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.domain.model.utils.EmployeeJobId;
import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.auth.infrastructure.service.NetworkService;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.SharedConstant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
  UserRepository repo;
  BusinessPagesOfEmployeeRepository bpRepo;
  ProfileRepository profileRepo;
  EmployeeJobRepository employeeJobRepo;
  NetworkService networkService;
  OrganizationService organizationService;
  BusinessPageService bpService;
  IndividualNotificationRepository indRepo;
  RoleRepository roleRepo;

  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class) // rollback neu co loi
  public void createEmployee(
    String userId, String username, String email, Roles role, @NonNull List<String> jobIds,
    String departmentId, String waterSupplyNetworkId, String fullName, String phone
  ) {
    log.info("UsersService is handling the request");

    var user = Users.create(builder -> builder
      .userId(userId)
      .email(email)
      .username(username)
      .role(role)
      .waterSupplyNetworkId(waterSupplyNetworkId)
      .isEnabled(true)
      .isLocked(false)
      .departmentId(departmentId));
    log.info("New account's information: {}", user);
    var entity = repo.save(user);

    var profile = Profile.create(builder -> builder
      .fullname(fullName)
      .users(entity)
      .phoneNumber(phone)
    );

    var p = profileRepo.save(profile);
    log.info("New profile's information: {}", p);
    jobIds.forEach(jid -> {
      var job = employeeJobRepo.save(EmployeeJob.create(builder -> builder
        .users(entity)
        .id(new EmployeeJobId(entity.getUserId(), jid))
      ));
      log.info("New employee's job: {}", job);
    });
  }

  @Override
  public boolean checkExistence(String value) {
    Objects.requireNonNull(value, "Value cannot be null");
    var isCredentialsExists = false;

    if (!value.isBlank()) {
      if (value.matches(SharedConstant.EMAIL_PATTERN)) {
        isCredentialsExists = repo.existsByEmail(value);
      } else {
        isCredentialsExists = repo.existsByUsername(value);
      }
    }

    log.info("Credentials is {}", isCredentialsExists ? "existing" : "not existing");

    return isCredentialsExists;
  }

  @Override
  public boolean isUserExists(String id) {
    log.info("Checking existence of user with id: {}", id);
    Objects.requireNonNull(id, "id cannot be null");
    return repo.existsById(id);
  }

  @Override
  public UserDTO getUserById(String id) {
    log.info("Getting user by id: {}", id);
    var user = getById(id);
    log.info("User found: {}", user);
    return returnUserDTO(user);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public UserDTO updateUsername(String id, String username) {
    log.info("Saving user: {}", username);
    var currentUser = getById(id);

    currentUser.setUsername(username);
    repo.save(currentUser);
    return returnUserDTO(currentUser);
  }

  @Override
  public Page<EmployeeResponse> getAllEmployeesWithStatus(Pageable pageable, FilterUsersRequest request) {
    log.info("Getting all active employees with activate status: {}", request);
    Page<Users> usersList;
//    var usersList = request.isEnabled() == null ? repo.findAll(pageable)
//      : repo.findByIsEnabledTrueAndIsLockedFalse(pageable);
//
//    if (request.username() != null) {
//      content = content.stream()
//        .filter(c -> c
//          .username().toLowerCase()
//          .contains(request.username().toLowerCase()))
//        .toList();
//    }
//    log.info("Found {} employees", content.size());

    if (request != null) {
      if (request.isEnabled() != null && request.username() == null) {
        usersList = repo.findByIsEnabledTrueAndIsLockedFalse(pageable);
      } else if (request.username() != null && request.isEnabled() == null) {
        usersList = repo.findByUsernameContainsIgnoreCase(request.username(), pageable);
      } else if (request.isEnabled() != null) {
        usersList = repo.findByIsEnabledTrueAndIsLockedFalseOrUsernameContainingIgnoreCase(request.username(), pageable);
      } else {
        usersList = repo.findAll(pageable);
      }
    } else {
      usersList = repo.findAll(pageable);
    }

    var content = usersList.getContent().stream().map(c -> {
      var profile = profileRepo.findById(c.getUserId());
      if (profile.isEmpty()) {
        throw new InternalError("Hồ sơ người dùng không tồn tại");
      }
      return mapToEmployeeResponse(c);
    }).toList();
    return new PageImpl<>(content, pageable, content.size());
  }

  @Override
  public UserDTO getUserByEmail(String email) {
    log.info("Getting user by email: {}", email);
    var user = getUsersByEmail(email);
    return returnUserDTO(user);
  }

  @Override
  public boolean isJobAssigned(String jobId) {
    log.info("Checking if job is assigned to any employee: {}", jobId);
    return employeeJobRepo.existsByIdJobId(jobId);
  }

  @Override
  public EmployeeResponse updateEmployee(String id, @NonNull UpdateRequest request) {
    var user = getById(id);
    var profile = profileRepo
      .findByUsersUsername(user.getUsername())
      .orElseThrow(() -> new NotExistingException("Không tìm thấy hồ sơ người dùng với id " + id));

    if (request.name() != null && !request.name().isBlank()) {
      profile.setFullname(request.name());
    }
    if (request.phone() != null && !request.phone().isBlank()) {
      profile.setPhoneNumber(request.phone());
    }
    if (request.isActive() != null) {
      user.setIsEnabled(request.isActive());
      // TODO: dùng keycloak để xác định session đăng nhập của người dùng, sau đó gửi thông báo và email cho họ
    }
    if (request.departmentId() != null && !request.departmentId().isBlank()) {
      var status = organizationService.checkDepartmentExistence(request.departmentId());
      if (!status) {
        throw new IllegalArgumentException("Phòng ban này không tồn tại: " + request.departmentId());
      }
      user.setDepartmentId(request.departmentId());
    }
    if (request.networkId() != null && !request.networkId().isBlank()) {
      var status = networkService.checkExistence(request.networkId());
      if (!status) {
        throw new IllegalArgumentException("Chi nhánh cấp nước này không tồn tại: " + request.networkId());
      }
      user.setWaterSupplyNetworkId(request.networkId());
    }

    return mapToEmployeeResponse(user);
  }

  @Override
  public EmployeeResponse deleteEmployee(String id) {
    log.info("Delete employee: {}", id);
    var emp = getById(id);
    if (!emp.getIsEnabled()) {
      throw new IllegalArgumentException(Message.SE_16);
    }

    emp.setIsEnabled(false);
    indRepo.deleteByUserId(id);
    bpRepo.deleteByUsers(emp);

    var rolesList = roleRepo.findByUsers(Set.of(emp));
    if (rolesList != null && !rolesList.isEmpty()) {
      var role = rolesList.getFirst();
      role.getUsers().removeIf(u -> u
        .getUserId()
        .equals(emp.getUserId())
      );
      roleRepo.save(role);
    }

    repo.save(emp);

    return mapToEmployeeResponse(emp);
  }

  @Override
  public String getRoleOfEmployee(String id) {
    var user = getById(id);
    return roleRepo.findByUsers(Set.of(user))
      .getFirst().getName().toString();
  }

  @Override
  public List<EmployeeResponse> getAllSurveyStaffs() {
    log.info("Getting all survey staff");
    var employees = repo.findByRoleNameIn(List.of(RoleName.SURVEY_STAFF));
    return employees.stream()
      .map(this::mapToEmployeeResponse)
      .collect(Collectors.toList());
  }

  @Override
  public String getSignificanceOfEmployee(String id) {
    var user = getById(id);
    return user.getElectronicSigningUrl();
  }

  @Override
  public UserDTO getByUserNameOrEmail(@NonNull String value) {
    if (value.trim().matches(SharedConstant.EMAIL_PATTERN)) {
      return getUserByEmail(value);
    } else {
      return returnUserDTO(repo.findByUsername(value));
    }
  }

  private Users getById(String id) {
    return repo
      .findById(id)
      .orElseThrow(() -> new NotExistingException(Message.SE_03 + ": " + id));
  }

  private @NonNull UserDTO returnUserDTO(@NonNull Users currentUser) {
    var jobIds = bpRepo.findPagesOfEmployeesByUsersUserId(currentUser.getUserId());
    return new UserDTO(
      currentUser.getUserId(),
      currentUser.getRole().getName().name(),
      currentUser.getUsername(),
      currentUser.getEmail(),
      currentUser.getIsLocked(),
      currentUser.getCreatedAt(),
      currentUser.getUpdatedAt(),
      currentUser.getLockedReason(),
      currentUser.getLockedAt(),
      jobIds,
      currentUser.getDepartmentId(),
      currentUser.getWaterSupplyNetworkId(),
      currentUser.getElectronicSigningUrl(),
      currentUser.getIsEnabled());
  }

  private @NonNull Users getUsersByEmail(String email) {
    var obj = repo.findByEmail(email);
    if (obj.isEmpty()) {
      throw new NotExistingException(Message.SE_02);
    }
    log.info("Find user by email: {}", obj);
    return obj.get();
  }

  private @NonNull EmployeeResponse mapToEmployeeResponse(@NonNull Users user) {
    var profile = profileRepo.findById(user.getUserId())
      .orElseThrow(() -> new NotExistingException(String.format(Message.SE_15, user.getUserId())));
    return new EmployeeResponse(
      user.getUserId(),
      null,
      profile.getFullname(),
      organizationService.getDepartmentName(user.getDepartmentId()),
      networkService.getNameById(user.getWaterSupplyNetworkId()),
      bpService.getPagesByEmployeeId(user.getUserId()).toString(),
      user.getEmail()
    );
  }
}
