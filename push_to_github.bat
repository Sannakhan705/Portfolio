@echo off
title Push Portfolio to GitHub
echo ===============================================================
echo Pushing Sanna Khan Portfolio to:
echo https://github.com/Sannakhan705/Portfolio
echo ===============================================================
echo.
"C:\Users\Khan Sanna\MinGit\cmd\git.exe" push -u origin main
echo.
echo ===============================================================
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code pushed successfully to GitHub!
) else (
    echo [NOTE] If prompted, sign in via browser or paste your GitHub Personal Access Token.
)
echo ===============================================================
pause
