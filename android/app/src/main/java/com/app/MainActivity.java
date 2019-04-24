package com.app;


import android.os.Bundle;
import android.os.Build;
import android.content.Context;
import android.os.PowerManager.WakeLock;
import android.os.PowerManager;
import android.app.KeyguardManager;
import android.app.Activity;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import org.devio.rn.splashscreen.SplashScreen;

import javax.annotation.Nullable;

public class MainActivity extends ReactActivity {

    public static class MessageActivityDelegate extends ReactActivityDelegate {
        private static final String MESSAGE_ID = "message";
        private Bundle mInitialProps = null;
        private final Activity mActivity;

        public MessageActivityDelegate(Activity activity, String mainComponentName) {
            super(activity, mainComponentName);
            this.mActivity = activity;
        }

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            // bundle is where we put our alarmID with launchIntent.putExtra
            Bundle bundle = mActivity.getIntent().getExtras();
            if (bundle != null && bundle.containsKey(MESSAGE_ID)) {
                Log.d("RNFMessagingService", bundle.getString(MESSAGE_ID));
                mInitialProps = new Bundle();
                // put any initialProps here
                mInitialProps.putString(MESSAGE_ID, bundle.getString(MESSAGE_ID));
            }


            //unlock and turn screen after new call
            if (Build.VERSION.SDK_INT >= 23) { // if android level height 23
                Window window = mActivity.getWindow();
                window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
                    | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                    | WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON);
            } else {// use for older versions
                //unlock screen
                KeyguardManager km = (KeyguardManager) mActivity.getSystemService(Context.KEYGUARD_SERVICE);
                final KeyguardManager.KeyguardLock kl = km.newKeyguardLock("");
                kl.disableKeyguard();

                //turn screen
                PowerManager pm = (PowerManager) mActivity.getSystemService(Context.POWER_SERVICE);
                WakeLock wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE, "");
                wakeLock.acquire();
                wakeLock.release();
            }

            SplashScreen.show(this.mActivity);
            super.onCreate(savedInstanceState);
        }

        @Override
        protected Bundle getLaunchOptions() {
            return mInitialProps;
        }
    };

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new MessageActivityDelegate(this, getMainComponentName());
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "";
    }
}
