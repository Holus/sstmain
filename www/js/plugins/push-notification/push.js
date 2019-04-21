angular.module('starter')

.factory('NotificationService', function($state, $ionicPush, $ionicEventEmitter, $ionicPopup, $rootScope, AppService, UserService) {
	return {
		init: function() {
			try {
				var thisObject = this;
				var push = $ionicPush;
				$ionicEventEmitter.on('push:notification', function(notification) {
					thisObject.doNotification(notification);
				});
				push.register().then(function(token) {
					thisObject.saveDeviceToken(token.token);
					AppService.updateAppSetting();
					return push.saveToken(token);
				});
			}
			catch(err) {
				$ionicPopup.alert({
					title: $rootScope.appLanguage.MESSAGE_TEXT,
					template: 'Push Notification plugin not found'
				});
			}
		},
		saveDeviceToken: function(token) {
			window.localStorage.setItem("deviceToken", token);
		},
		getDeviceToken: function() {
			return window.localStorage.getItem("deviceToken");
		},
		doNotification: function(notification) {
			if(notification.message.payload.type === 'text') {
				this.textNotification(notification);
			}else if(notification.message.payload.type === 'order'){
				this.orderNotification(notification);
			}
		},
		textNotification: function(notification){
			window.localStorage.setItem("appNotificationPayload", JSON.stringify(notification.message.payload));
			if(!notification.raw.additionalData.foreground) {
				$state.go('tab.notification');
			}
			else {
				var confirmPopup = $ionicPopup.confirm({
					title: $rootScope.appLanguage.NOTIFICATION_TEXT,
					template: 'You have a new notification - go to it?'
				});
				confirmPopup.then(function(res) {
					if(res) {
						$state.go('tab.notification');
					}
				});
			}
		},
		orderNotification: function(notification){
			if(!notification._raw.additionalData.foreground) {
				var orderInfo = notification.payload.data;
				window.localStorage.setItem("singleOrder", JSON.stringify(orderInfo));
				$state.go('tab.order');
			}
			else {
				var confirmPopup = $ionicPopup.confirm({
					title: $rootScope.appLanguage.NOTIFICATION_TEXT,
					template: 'You have a new notification - go to it?'
				});
				confirmPopup.then(function(res) {
					if(res) {
						$state.go('tab.orders');
					}
				});
			}
		}
  	};
})
;