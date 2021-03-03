#!/bin/bash
GIT_USER=tippettj
# Directory where phoronix/phoronix-test-suite is cloned to
PHORONIX_ROOT=$HOME/phoronix-test-suite 
# Directory where phoronix/check-stats is cloned to
PHORONIX_STATS_ROOT=$HOME/phoronix-stats 
# temp dir to clone gh-pages repository
TEMP_GH_PAGES_DIR=/tmp/gh-pages

JSON_FILE=check-tests-results.json
# directory where the test results are stored
PHORONIX_LOCAL_JSON=$HOME/.phoronix-test-suite/openbenchmarking.org/$JSON_FILE
# directory where the client reads the json results
RESULTS_DEST=$PHORONIX_STATS_ROOT/public 

if [ -d $PHORONIX_ROOT ]
then
    if [ -d $PHORONIX_ROOT/.git ] then
        cd $PHORONIX_ROOT
        echo "Pulling latest changes from $USER/phoronix-test-suite..."
        git pull

        # Back up last json file
        if [ -e $PHORONIX_LOCAL_JSON] then
            rm $PHORONIX_LOCAL_JSON.*
            cp $PHORONIX_LOCAL_JSON $PHORONIX_LOCAL_JSON.`$(date +%F)`
        fi

        echo "Running check-tests ..."
        #./phoronix-test-suite check-tests

        if [ -e $PHORONIX_LOCAL_JSON] then
            echo "Checking out gh-pages branch from $GIT_USER/phoronix-stats ..."
            # mkdir -p $TEMP_GH_PAGES_DIR
            # cd $TEMP_GH_PAGES_DIR
            # git clone git@github.com:$USER/phoronix-stats.git
            # cd $TEMP_GH_PAGES_DIR/phoronix-stats
            # git checkout gh-pages
            # cp $PHORONIX_LOCAL_JSON $TEMP_GH_PAGES_DIR/phoronix-stats

            echo "Pushing new JSON file to gh-pages branch in $USER/phoronix-stats"
            # git add $JSON_FILE
            # git commit -m "latest test run"
            # git push 

            # cd
            # rm -rf $TEMP_GH_PAGES_DIR
        else    
            echo "Test Failed. Unable to locate $JSON_FILE"
        fi
        
    else
        echo "Unable to pull latest - .git folder does not exist in $PHORONIX_ROOT"
    fi
else
    echo "$PHORONIX_ROOT not found"
fi
    