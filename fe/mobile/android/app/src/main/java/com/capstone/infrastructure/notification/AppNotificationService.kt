package com.capstone.infrastructure.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.capstone.ui.views.MainActivity
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

/**
 * Service để nhận thông báo từ Firebase Cloud Messaging (FCM).
 */
class AppNotificationService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        // Nhận dữ liệu từ thông báo
        val title = remoteMessage.notification?.title ?: "New Notification"
        val message = remoteMessage.notification?.body ?: "You have a new update."

        showNotification(title, message)
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // TODO: Gửi token lên server để quản lý device token
        println("New FCM Token: $token")
    }

    private fun showNotification(title: String, message: String) {
        val channelId = "capstone_notifications"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Capstone Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            notificationManager.createNotificationChannel(channel)
        }

        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // Placeholder icon
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true)

        notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
    }
}
