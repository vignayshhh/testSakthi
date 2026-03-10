package com.sakthicare.app

import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import expo.modules.notifications.notifications.service.ScheduledNotificationReceiver

class BootReceiver : ScheduledNotificationReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        
        Log.d("SakthiCare", "Boot receiver triggered: ${intent.action}")
        
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            "android.intent.action.QUICKBOOT_POWERON",
            "com.htc.intent.action.QUICKBOOT_POWERON" -> {
                Log.d("SakthiCare", "Device boot/restart detected, rescheduling notifications")
                
                // Reschedule all meal notifications
                try {
                    val serviceIntent = Intent(context, NotificationRescheduleService::class.java)
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        context.startForegroundService(serviceIntent)
                    } else {
                        context.startService(serviceIntent)
                    }
                } catch (e: Exception) {
                    Log.e("SakthiCare", "Error starting notification reschedule service", e)
                }
            }
        }
    }
}
