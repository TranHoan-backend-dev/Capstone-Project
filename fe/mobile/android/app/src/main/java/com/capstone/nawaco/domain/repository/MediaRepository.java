package com.capstone.nawaco.domain.repository;

import java.io.File;

public interface MediaRepository {
    String processCapturedImage(File file) throws Exception;

    String performOcr(String imageUrl) throws Exception;
}
