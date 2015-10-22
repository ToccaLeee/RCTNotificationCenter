
/**
 * NotificationCenterIOS
 * Tocca Lee
 * 2015.10.10
 */

'use strict'

var React = require('react-native');
var invariant = require('invariant');

var {
  NativeModules,
  DeviceEventEmitter,
} = React;

var commonIOSNotification = 'IOSCommonNotification';

var NotificationCenter = NativeModules.NotificationCenter;

var notificationListeners = {};
DeviceEventEmitter.addListener(commonIOSNotification, (notificationData) => {
  var notifName = notificationData.name;
  var notifData = {object:notificationData.object, userInfo:notificationData.userInfo};
  for (var i = 0; i < notificationListeners[notifName].length; i++) {
    var listener = notificationListeners[notifName][i];
    listener(notifData);
  };
});

function addObserver(notificationName, callback) {
  checkString(notificationName);
  checkCallBack(callback);
  notificationListeners[notificationName] = notificationListeners[notificationName] ?
                                            notificationListeners[notificationName].push(callback) : [callback];
  NotificationCenter.addObserver(notificationName);
};

function postNotification(notificationName, data) {
   checkString(notificationName);
   NotificationCenter.postNotification(notificationName, data);
};

function removeObserver(notificationName, callback) {
  checkString(notificationName);
  checkCallBack(callback);
  var listenerIndex = notificationListeners[notificationName].indexOf(callback);
  if (listenerIndex !== -1) {
    notificationListeners[notificationName].splice(listenerIndex, 1);
  }

  if (!notificationListeners[notificationName].length) {
     removeAllObservers(notificationName);
  };
}

function removeAllObservers(notificationName) {
  checkString(notificationName);
  NotificationCenter.removeObserver(notificationName);
  delete notificationListeners[notificationName];
  if (!notificationListeners.length) {
      DeviceEventEmitter.removeAllListeners(commonIOSNotification);
  };
}

function checkCallBack(callback) {
 invariant(typeof callback === 'function', 'callback Must provide a valid callback');
}

function checkString(string) {
 invariant(typeof string === 'string', 'Must provide a valid string');
}

var NotificationCenterIOS = {
  addObserver,
  postNotification,
  removeObserver,
  removeAllObservers,
};

module.exports = NotificationCenterIOS;
