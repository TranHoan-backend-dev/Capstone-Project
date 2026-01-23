package com.capstone.auth.infrastructure.service;

import com.capstone.auth.domain.repository.UserRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomUserDetailsService implements UserDetailsService {

  UserRepository userRepository;

  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  public @NonNull UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
    var user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    // Check if user account is active
    if (!user.isAccountNonLocked()) {
      throw new UsernameNotFoundException("User account is inactive");
    }

    var authorities = Collections.singletonList(
        new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));

    user.setAuthorities(authorities);
    return user;
  }
}
