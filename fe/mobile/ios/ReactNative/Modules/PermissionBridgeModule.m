#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PermissionModule, NSObject)

RCT_EXTERN_METHOD(canAccessFullFeatures:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(canAccessModule:(NSString *)moduleName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
