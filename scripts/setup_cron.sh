#!/bin/sh

# Set up a cron to run every saturday at 2am
(crontab -l ; echo "0 2 * * 6 ./${HOME}/phoronix-stats/scripts/run-check-tests.sh") | crontab -