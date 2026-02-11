package com.capstone.auth.application.business.temp;

import java.util.Set;

public interface TempService {
  void addNewTemps(Set<String> temps);

  void deleteTemps();
}
