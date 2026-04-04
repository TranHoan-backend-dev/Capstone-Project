#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MediaModule, NSObject)

RCT_EXTERN_METHOD(uploadCapturedImage:(NSString *)filePath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(performOcr:(NSString *)imageUrl
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
