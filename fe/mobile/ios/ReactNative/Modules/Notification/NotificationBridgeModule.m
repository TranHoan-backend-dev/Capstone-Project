#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NotificationModule, NSObject)

RCT_EXTERN_METHOD(getNotifications:(int)page
                  size:(int)size
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(markAsRead:(NSString *)notificationId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
