@echo off

echo "*********************DB set up start ********************"

set projectpath="C:\xampp\htdocs\returnFiling"
set mongoHome="C:\Program Files\MongoDB\Server\3.0\bin"

REM cd %mongoHome%
mongorestore
REM cd %projectpath%
echo "*********************Close terminal ********************"
pause
