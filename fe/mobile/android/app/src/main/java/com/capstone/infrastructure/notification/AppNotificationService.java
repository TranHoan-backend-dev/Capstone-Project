package com.capstone.infrastructure.notification;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

/**
 * Service xử lý các thông báo nhận được từ Firebase Cloud Messaging (FCM).
 */
public class AppNotificationService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        RemoteMessage.Notification notification = remoteMessage.getNotification();
        var title = (notification != null && notification.getTitle() != null) ? notification.getTitle() : "New Notification";
        var message = (notification != null && notification.getBody() != null) ? notification.getBody() : "You have a new update.";

        showNotification(title, message);
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        // Lưu token hoặc gửi lên Server Backend của ứng dụng để gắn thiết bị với User
        Log.i(this.getClass().getName(), "New FCM Token: " + token);
    }

    /**
     * Hiển thị thông báo trên thanh trạng thái của Android.
     */
    private void showNotification(String title, String message) {
        var channelId = "capstone_notifications";
        var notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            var channel = new NotificationChannel(
                    channelId,
                    "Capstone Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            notificationManager.createNotificationChannel(channel);
        }

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info) // Icon mặc định tạm thời
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true);

        // Notify bằng ID duy nhất theo thời gian thực
        notificationManager.notify((int) System.currentTimeMillis(), notificationBuilder.build());
    }
}
