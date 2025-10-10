@echo off
:loop
git add .
git commit -m "Auto commit %date% %time%"
git push origin main
timeout /t 300 >nul
goto loop
