const fs = require('fs');

const projectPath = 'd:/Du_an_ca_nhan/Capstone project/be/fe/mobile/ios/ReactNative.xcodeproj/project.pbxproj';
let content = fs.readFileSync(projectPath, 'utf8');

const filesToAdd = [
    { name: 'Models.swift', path: 'ReactNative/Source/Domain/Entities/Models.swift', type: 'sourcecode.swift' },
    { name: 'AuthRepository.swift', path: 'ReactNative/Source/Data/Repositories/AuthRepository.swift', type: 'sourcecode.swift' },
    { name: 'MediaRepository.swift', path: 'ReactNative/Source/Data/Repositories/MediaRepository.swift', type: 'sourcecode.swift' },
    { name: 'MeterRepository.swift', path: 'ReactNative/Source/Data/Repositories/MeterRepository.swift', type: 'sourcecode.swift' },
    { name: 'NotificationRepository.swift', path: 'ReactNative/Source/Data/Repositories/NotificationRepository.swift', type: 'sourcecode.swift' },
    { name: 'PaymentRepository.swift', path: 'ReactNative/Source/Data/Repositories/PaymentRepository.swift', type: 'sourcecode.swift' },
    { name: 'TokenManager.swift', path: 'ReactNative/Source/Data/Local/TokenManager.swift', type: 'sourcecode.swift' },
    { name: 'PermissionManager.swift', path: 'ReactNative/Source/Core/Utilities/PermissionManager.swift', type: 'sourcecode.swift' },
    { name: 'MeterCaptureManager.swift', path: 'ReactNative/Source/Core/Utilities/MeterCaptureManager.swift', type: 'sourcecode.swift' },
    { name: 'AntiBruteForceManager.swift', path: 'ReactNative/Source/Core/Utilities/AntiBruteForceManager.swift', type: 'sourcecode.swift' },
    { name: 'AuthBridgeModule.m', path: 'ReactNative/Source/Bridge/Auth/AuthBridgeModule.m', type: 'sourcecode.c.objc' },
    { name: 'AuthBridgeModule.swift', path: 'ReactNative/Source/Bridge/Auth/AuthBridgeModule.swift', type: 'sourcecode.swift' },
    { name: 'MediaBridgeModule.m', path: 'ReactNative/Source/Bridge/Media/MediaBridgeModule.m', type: 'sourcecode.c.objc' },
    { name: 'MediaBridgeModule.swift', path: 'ReactNative/Source/Bridge/Media/MediaBridgeModule.swift', type: 'sourcecode.swift' },
    { name: 'MeterBridgeModule.m', path: 'ReactNative/Source/Bridge/Meter/MeterBridgeModule.m', type: 'sourcecode.c.objc' },
    { name: 'MeterBridgeModule.swift', path: 'ReactNative/Source/Bridge/Meter/MeterBridgeModule.swift', type: 'sourcecode.swift' },
    { name: 'NotificationBridgeModule.m', path: 'ReactNative/Source/Bridge/Notification/NotificationBridgeModule.m', type: 'sourcecode.c.objc' },
    { name: 'NotificationBridgeModule.swift', path: 'ReactNative/Source/Bridge/Notification/NotificationBridgeModule.swift', type: 'sourcecode.swift' },
    { name: 'PaymentBridgeModule.m', path: 'ReactNative/Source/Bridge/Payment/PaymentBridgeModule.m', type: 'sourcecode.c.objc' },
    { name: 'PaymentBridgeModule.swift', path: 'ReactNative/Source/Bridge/Payment/PaymentBridgeModule.swift', type: 'sourcecode.swift' },
    { name: 'PermissionBridgeModule.m', path: 'ReactNative/Source/Bridge/Permission/PermissionBridgeModule.m', type: 'sourcecode.c.objc' },
    { name: 'PermissionBridgeModule.swift', path: 'ReactNative/Source/Bridge/Permission/PermissionBridgeModule.swift', type: 'sourcecode.swift' },
];

function generateUUID() {
    return 'CMSN' + Math.random().toString(16).substr(2, 20).toUpperCase().padStart(20, '0');
}

let fileRefs = '';
let buildFiles = '';
let buildPhaseRefs = '';
let groupChildren = '';

filesToAdd.forEach(file => {
    const fileId = generateUUID();
    const buildId = generateUUID();
    
    // 1. PBXFileReference
    fileRefs += `\t\t${fileId} /* ${file.name} */ = {isa = PBXFileReference; lastKnownFileType = ${file.type}; name = ${file.name}; path = ${file.path}; sourceTree = "<group>"; };\n`;
    
    // 2. PBXBuildFile
    buildFiles += `\t\t${buildId} /* ${file.name} in Sources */ = {isa = PBXBuildFile; fileRef = ${fileId} /* ${file.name} */; };\n`;
    
    // 3. PBXSourcesBuildPhase
    buildPhaseRefs += `\t\t\t\t${buildId} /* ${file.name} in Sources */,\n`;
    
    // 4. Group children
    groupChildren += `\t\t\t\t${fileId} /* ${file.name} */,\n`;
});

// Insert sections
content = content.replace('/* End PBXBuildFile section */', buildFiles + '/* End PBXBuildFile section */');
content = content.replace('/* End PBXFileReference section */', fileRefs + '/* End PBXFileReference section */');
content = content.replace('files = (\n\t\t\t\t761780ED2CA45674006654EE /* AppDelegate.swift in Sources */,', 'files = (\n\t\t\t\t761780ED2CA45674006654EE /* AppDelegate.swift in Sources */,\n' + buildPhaseRefs);

// Reorganize Group
content = content.replace('children = (\n\t\t\t\t13B07FB51A68108700A75B9A /* Images.xcassets */,\n\t\t\t\t761780EC2CA45674006654EE /* AppDelegate.swift */,\n\t\t\t\t13B07FB61A68108700A75B9A /* Info.plist */,\n\t\t\t\t81AB9BB72411601600AC10FF /* LaunchScreen.storyboard */,\n\t\t\t\t13B07FB81A68108700A75B9A /* PrivacyInfo.xcprivacy */,\n\t\t\t);', 
    'children = (\n\t\t\t\t13B07FB51A68108700A75B9A /* Images.xcassets */,\n\t\t\t\t761780EC2CA45674006654EE /* AppDelegate.swift */,\n\t\t\t\t13B07FB61A68108700A75B9A /* Info.plist */,\n\t\t\t\t81AB9BB72411601600AC10FF /* LaunchScreen.storyboard */,\n\t\t\t\t13B07FB81A68108700A75B9A /* PrivacyInfo.xcprivacy */,\n' + groupChildren + '\t\t\t);');

fs.writeFileSync(projectPath, content);
console.log('Successfully updated project.pbxproj with new Clean Architecture files!');
