package com.capstone.construction.infrastructure.startup;

import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// TODO: Xem lại cái này
@Slf4j
@Component
@RequiredArgsConstructor
public class CommuneSearchBackfillRunner implements ApplicationRunner {
  private final CommuneRepository communeRepository;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    // Ensure existing rows (before nameSearch column existed) can be searched immediately.
    var communes = communeRepository.findAll();
    var toUpdate = communes.stream()
      .filter(c -> c.getNameSearch() == null || c.getNameSearch().isBlank())
      .toList();

    if (toUpdate.isEmpty()) return;

    toUpdate.forEach(c -> c.setName(c.getName()));
    communeRepository.saveAll(toUpdate);
    log.info("Backfilled nameSearch for {} commune(s)", toUpdate.size());
  }
}

