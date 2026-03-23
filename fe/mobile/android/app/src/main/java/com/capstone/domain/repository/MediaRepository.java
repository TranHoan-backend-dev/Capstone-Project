package com.capstone.domain.repository;

import java.io.File;

public interface MediaRepository {
    String processCapturedImage(File file) throws Exception;

    String performOcr(String imageUrl) throws Exception;
}
