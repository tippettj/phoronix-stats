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

BLUE='\033[0;34m'
RED='\033[33;31m'
NC='\033[0m' # No Color

if [ -d $PHORONIX_ROOT ]
then
    if [ -d $PHORONIX_ROOT/.git ] 
    then
        cd $PHORONIX_ROOT
        echo -e "${BLUE}Pulling latest changes from $GIT_USER/phoronix-test-suite...${NC}"
        git pull

        # Back up last json file
        if [ -e $PHORONIX_LOCAL_JSON ] 
        then
            rm $PHORONIX_LOCAL_JSON.*
            cp $PHORONIX_LOCAL_JSON $PHORONIX_LOCAL_JSON.`(date +%F)`
        fi

        echo -e "${BLUE}Running check-tests ...${NC}"
        #./phoronix-test-suite check-tests

        if [ -e $PHORONIX_LOCAL_JSON ] 
        then
            echo -e "${BLUE}Checking out gh-pages branch from git repository $GIT_USER/phoronix-stats ...${NC}"
            if [ -d $TEMP_GH_PAGES_DIR ]
            then
                rm -rf $TEMP_GH_PAGES_DIR
            fi

            mkdir -p $TEMP_GH_PAGES_DIR
            cd $TEMP_GH_PAGES_DIR
            git clone git@github.com:$GIT_USER/phoronix-stats.git
            cd $TEMP_GH_PAGES_DIR/phoronix-stats
            git checkout gh-pages
            cp $PHORONIX_LOCAL_JSON $TEMP_GH_PAGES_DIR/phoronix-stats

            echo -e "${BLUE}Pushing new JSON file to gh-pages branch in $USER/phoronix-stats${NC}"
            git add $JSON_FILE
            git commit -m "latest test run"
            git push 

            rm -rf $TEMP_GH_PAGES_DIR
        else    
            echo -e "${RED}Test Failed. Unable to locate $JSON_FILE${NC}"
        fi
        
    else
        echo -e "${RED}Unable to pull latest - .git folder does not exist in $PHORONIX_ROOT ${NC}"
    fi
else
    echo -e "${RED}$PHORONIX_ROOT not found${NC}"
fi
    