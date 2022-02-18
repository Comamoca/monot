#! /usr/bin/bash

echo -e "\e[32m [LOG] \e[mfetch start🔫"
git fetch root
echo -e "\e[32m [LOG] \e[mRun git merge💨"
git merge origin main
echo -e "\e[32m [LOG] \e[mPushing...⬆ "
git push origin main
echo -e "\e[32m [LOG] \e[mDone✨"
