#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PaymentModule, NSObject)

RCT_EXTERN_METHOD(getPayments:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
