
'use strict';

var React = require('react-native');
var NotificationCenterIOS = require('./NotificationCenterIOS');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
} = React;

var Test = React.createClass({

  getInitialState: function() {
    return {
      notificationContent: '无通知数据',
    };
  },

  componentWillMount() {
    NotificationCenterIOS.addObserver("NotificationTest", this.receiveNotification);
  },

  componentWillUnmount() {
    NotificationCenterIOS.removeObserver("NotificationTest", this.receiveNotification);
  },

  receiveNotification: function(notificationData) {
    alert("I have received notificationData from native");
    if (notificationData.object !== undefined) {
      this.setState({notificationContent: notificationData.object});
    }
  },

  render() {
    return(
      <View style={styles.container}>
         <Text style={styles.title}>NotificationCenter Test</Text>
         <Text style={styles.content}>{this.state.notificationContent}</Text>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    color: 'red',
  },

  content: {
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },

});

AppRegistry.registerComponent('Test', () => Test);
