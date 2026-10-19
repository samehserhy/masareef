@echo off
chcp 65001 >nul
echo === بناء تطبيق المصاريف ===
if not exist node_modules call npm install || goto :err
if not exist android call npx cap add android || goto :err
call node setup-android.mjs || goto :err
call npx cap sync android || goto :err
call node setup-android.mjs || goto :err
cd android
call gradlew.bat assembleDebug || goto :err
cd ..
echo.
echo تم! الملف هنا: android\app\build\outputs\apk\debug\app-debug.apk
pause
exit /b 0
:err
echo حدث خطأ — انسخ آخر سطور الشاشة وأرسلها لي.
pause
exit /b 1
