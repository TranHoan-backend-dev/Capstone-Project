package com.capstone.construction.infrastructure.startup;

import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommuneSearchBackfillRunner implements ApplicationRunner {
  private final CommuneRepository communeRepository;

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    // NOTE:
    // The current Commune schema/entity does NOT include a `nameSearch` field/column,
    // so there is nothing to backfill here. This runner is intentionally a no-op.
    log.debug("CommuneSearchBackfillRunner skipped (nameSearch not present in current schema).");
  }
}

