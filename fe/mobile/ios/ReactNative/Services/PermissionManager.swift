import Foundation

@objc class PermissionManager: NSObject {
    static let ROLE_BUSINESS_EMPLOYEE = "BUSINESS_DEPARTMENT_EMPLOYEE"

    @objc static let shared = PermissionManager()

    private let tokenManager = TokenManager.shared

    private override init() {
        super.init()
    }

    func canAccessFullFeatures() -> Bool {
        let currentRole = tokenManager.getUserRole()
        return PermissionManager.ROLE_BUSINESS_EMPLOYEE == currentRole
    }

    func canAccessModule(moduleName: String) -> Bool {
        let publicModules = ["HOME", "AUTH", "PROFILE"]

        if publicModules.contains(moduleName.uppercased()) {
            return true
        }

        return canAccessFullFeatures()
    }
}
