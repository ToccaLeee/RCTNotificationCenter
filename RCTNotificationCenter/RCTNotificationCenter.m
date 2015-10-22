//
//  RCTNotificationCenter.m
//
//  Created by ToccaLee on 21/10/15.
//

#import "RCTNotificationCenter.h"
#import "RCTEventDispatcher.h"

@implementation RCTNotificationCenter

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(NotificationCenter)

RCT_EXPORT_METHOD(postNotification:(NSString *)notificationName userInfo:(NSDictionary *)userInfo) {
    [[NSNotificationCenter defaultCenter] postNotificationName:notificationName
                                                        object:nil
                                                      userInfo:userInfo];
}

RCT_EXPORT_METHOD(postNotification:(NSString *)notificationName) {
    [[NSNotificationCenter defaultCenter] postNotificationName:notificationName
                                                        object:nil
                                                      userInfo:nil];
}

RCT_EXPORT_METHOD(addObserver:(NSString *)notificationName) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(bridgeNotification:)
                                                 name:notificationName
                                               object:nil];
}

RCT_EXPORT_METHOD(removeObserver:(NSString *)notificationName) {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:notificationName
                                                  object:nil];
}

- (void)bridgeNotification:(NSNotification *)notification {
    NSDictionary *notificationData = @{@"name": notification.name,
                                       @"userInfo": notification.userInfo ?: [NSNull null],
                                       @"object": notification.object ?: [NSNull null]};
    [self.bridge.eventDispatcher sendDeviceEventWithName:@"IOSCommonNotification"
                                                    body:notificationData];

}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
