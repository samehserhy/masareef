#!/usr/bin/env bash
set -e
[ -d node_modules ] || npm install
[ -d android ] || npx cap add android
node setup-android.mjs
npx cap sync android
node setup-android.mjs
(cd android && chmod +x gradlew && ./gradlew assembleDebug)
echo "تم! الملف: android/app/build/outputs/apk/debug/app-debug.apk"
