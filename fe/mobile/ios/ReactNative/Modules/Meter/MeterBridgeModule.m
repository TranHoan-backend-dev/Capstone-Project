#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MeterModule, NSObject)

RCT_EXTERN_METHOD(saveMeterReading:(NSDictionary *)readingMap
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateManualMeterReading:(NSString *)readingId
                  serialNumber:(NSString *)serialNumber
                  readingValue:(double)readingValue
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
