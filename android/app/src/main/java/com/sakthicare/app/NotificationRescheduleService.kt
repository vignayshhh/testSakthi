package com.sakthicare.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

class NotificationRescheduleService : Service() {
    
    companion object {
        private const val NOTIFICATION_CHANNEL_ID = "notification_reschedule"
        private const val NOTIFICATION_ID = 1001
    }
    
    override fun onCreate() {
        super.onCreate()
        Log.d("SakthiCare", "NotificationRescheduleService created")
        createNotificationChannel()
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("SakthiCare", "Starting notification reschedule service")
        
        // Show notification for foreground service
        startForeground(NOTIFICATION_ID, createNotification())
        
        // Reschedule notifications in a background thread
        Thread {
            try {
                Thread.sleep(2000) // Wait for app to fully initialize
                
                // Trigger notification rescheduling
                val rescheduleIntent = Intent("com.sakthicare.app.RESCHEDULE_NOTIFICATIONS")
                sendBroadcast(rescheduleIntent)
                
                Log.d("SakthiCare", "Notification reschedule broadcast sent")
                
                // Stop the service after rescheduling
                stopSelf()
            } catch (e: Exception) {
                Log.e("SakthiCare", "Error in notification reschedule service", e)
                stopSelf()
            }
        }.start()
        
        return START_NOT_STICKY
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Notification Reschedule",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Rescheduling meal notifications after device restart"
                setShowBadge(false)
            }
            
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setContentTitle("SakthiCare")
            .setContentText("Rescheduling meal notifications...")
            .setSmallIcon(R.drawable.notification_icon)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setAutoCancel(false)
            .build()
    }
}
