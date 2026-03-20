package com.capstone.infrastructure.security;

import java.util.Arrays;
import java.util.List;
import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class PermissionManager {
    public static final String ROLE_BUSINESS_EMPLOYEE = "BUSINESS_DEPARTMENT_EMPLOYEE";

    private final TokenManager tokenManager;

    @Inject
    public PermissionManager(TokenManager tokenManager) {
        this.tokenManager = tokenManager;
    }

    public boolean canAccessFullFeatures() {
        String currentRole = tokenManager.getUserRole();
        return ROLE_BUSINESS_EMPLOYEE.equals(currentRole);
    }

    public boolean canAccessModule(String moduleName) {
        List<String> publicModules = Arrays.asList("HOME", "AUTH", "PROFILE");
        
        if (publicModules.contains(moduleName.toUpperCase())) {
            return true;
        }

        return canAccessFullFeatures();
    }
}
