package com.capstone.auth.application.business.temp;

import com.capstone.auth.domain.model.utils.Temp;
import com.capstone.auth.infrastructure.persistence.TempRepository;
import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.util.Set;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TempServiceImpl implements TempService {
  TempRepository repo;
  @NonFinal
  Logger log;

  @Override
  public void addNewTemps(Set<String> temps) {
    log.info("Adding new temps: {}", temps);
    temps.forEach(t -> repo.save(new Temp(t)));
  }

  @Override
  public void deleteTemps() {
    log.info("Deleting all temps");
    repo.deleteAll();
  }
}
