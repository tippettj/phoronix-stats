#!/bin/bash
#Add -x for verbose
GIT_USER=tippettj
# Directory where phoronix/phoronix-test-suite is cloned to
PHORONIX_ROOT=$HOME/phoronix-test-suite 
# Directory where phoronix/check-stats is cloned to
PHORONIX_STATS_ROOT=$HOME/phoronix-stats 
# temp dir to clone gh-pages repository
TEMP_GH_PAGES_DIR=/tmp/gh-pages

JSON_FILE=check-tests-results.json
# directory where the test results are stored
PHORONIX_LOCAL=${HOME}/.phoronix-test-suite/openbenchmarking.org
PHORONIX_LOCAL_JSON=${PHORONIX_LOCAL}/${JSON_FILE}
# directory where the client reads the json results
RESULTS_DEST=${PHORONIX_STATS_ROOT}/public 

CYAN='\033[1;36m'
RED='\033[1;31m'
NC='\033[0m' # No Color

DEV_MODE="false"

# clean up at end of execution or if there is an interrupt
trap cleanUp EXIT

cleanUp() { 
    #Group id command for deleting all check-tests processes --> ps x -o  "%p %r %y %x %c "
    echo -e "${CYAN}Cleaning up ... "

    # remove the temporary github pages
    if [ -d ${TEMP_GH_PAGES_DIR} ]
    then
        rm -rf ${TEMP_GH_PAGES_DIR}
    fi
 
    # if this file exists the next test will used these cached results 
    if [ -e ${PHORONIX_LOCAL}/check-tests-tested.txt ]
    then
        echo -e "Removing cached tests and temporary files ..."
        rm ${PHORONIX_LOCAL}/check-tests-tested.txt
    fi

    # any files with the format xxx.json.1234 are files left over from cancelled processes
    if [ `ls -1 ${PHORONIX_LOCAL}/*.json.* 2>/dev/null | wc -l ` -gt 0 ];
    then
        rm ${PHORONIX_LOCAL}/*.json.*
    fi

    # remove any downloaded files
    if [ -d ${PHORONIX_LOCAL}/checkTestsDownloads ]
    then
        rm -rf ${PHORONIX_LOCAL}/checkTestsDownloads
    fi

    exit 1;

}

# Push the JSON file to the gh-pages repository
pushJSON() {
    if [ -e ${PHORONIX_LOCAL_JSON} ] 
        then
            echo -e "${CYAN}Checking out gh-pages branch from git repository ${GIT_USER}phoronix-stats ...${NC}"
            if [ -d ${TEMP_GH_PAGES_DIR} ]
            then
                rm -rf ${TEMP_GH_PAGES_DIR}
            fi

            mkdir -p ${TEMP_GH_PAGES_DIR}
            cd ${TEMP_GH_PAGES_DIR}
            git clone git@github.com:${GIT_USER}/phoronix-stats.git
            cd ${TEMP_GH_PAGES_DIR}/phoronix-stats
            git checkout gh-pages
            cp ${PHORONIX_LOCAL_JSON} ${TEMP_GH_PAGES_DIR}/phoronix-stats

            echo -e "${CYAN}Pushing new JSON file to gh-pages branch in ${GIT_USER}/phoronix-stats${NC}"
            git add ${JSON_FILE}
            git commit -m "Automated check-tests run on `(date +%F)`"
            git push 

            rm -rf ${TEMP_GH_PAGES_DIR}
        else    
            echo -e "${RED}Test Failed. Unable to locate ${JSON_FILE}${NC}"
        fi

        exit 1;
}

#  Read any arguments
while getopts 'dhcps:' flag; do
  case "${flag}" in
    d) DEV_MODE="true" ;;
    c) cleanUp ;;
    p) pushJSON ;;
    h) 
        echo " "
        echo "NAME"
        echo "      run-check-tests - runs the Phoronix Test Suite check-tests command"
        echo " "
        echo "SYNOPSIS"
        echo "      run-check-tests [options] test-profiles"
        echo " "
        echo "DESCRIPTION"
        echo "      Runs the Phoronix Test Suite check-tests command, generating a JSON file."
        echo "      JSON file is checked into git phoronix-stats repository for display in phoronix-stats github pages."
        echo " "
        echo "      -h        show help"
        echo "      -d        run in DEV MODE. Named test-profiles will only run in DEV MODE"
        echo "      -c        clean up"
        echo "      -p        push json file to gh-pages"
        echo " "
       exit 1 ;;
  esac
done
# Any remaining args are specific test-profiles to run
shift $((OPTIND -1))
echo $*
_profiles=$*
  
if [ "$DEV_MODE" = "true"  ]
then
    if [ "$_profiles" = "" ]
    then
        echo -e "${RED}DEV MODE must have named profiles. Using default profiles pts/blake2-1.2.1 pts/askap-1.0.0${NC}"
        _profiles="pts/blake2-1.2.1 pts/askap-1.0.0"
    fi
fi

if [ -d ${PHORONIX_ROOT} ]
then
    if [ -d ${PHORONIX_ROOT}/.git ] 
    then
        echo -e "${CYAN}Pulling latest changes from git repository ${GIT_USER}/phoronix-test-suite...${NC}"
        cd ${PHORONIX_ROOT}
        git pull

        # Back up last json file
        # if [ -e ${PHORONIX_LOCAL_JSON} ] 
        # then
        #     rm ${PHORONIX_LOCAL_JSON}.*
        #     cp ${PHORONIX_LOCAL_JSON} ${PHORONIX_LOCAL_JSON}`(date +%F)`
        # fi

        echo -e "${CYAN}Running check-tests ...${NC}"
        if [ "$DEV_MODE" = "true"  ]
        then
            echo -e "${CYAN}In DEV MODE ... Running check-tests with $_profiles${NC}"
            ./phoronix-test-suite check-tests $_profiles
        else
            ./phoronix-test-suite check-tests
        fi

        # if we have sucessfully created a JSON results file, push it to github
        if [ -e ${PHORONIX_LOCAL_JSON} ] 
        then
            echo -e "${CYAN}Checking out gh-pages branch from git repository ${GIT_USER}phoronix-stats ...${NC}"
            if [ -d ${TEMP_GH_PAGES_DIR} ]
            then
                rm -rf ${TEMP_GH_PAGES_DIR}
            fi

            mkdir -p ${TEMP_GH_PAGES_DIR}
            cd ${TEMP_GH_PAGES_DIR}
            git clone git@github.com:${GIT_USER}/phoronix-stats.git
            cd ${TEMP_GH_PAGES_DIR}/phoronix-stats
            git checkout gh-pages
            cp ${PHORONIX_LOCAL_JSON} ${TEMP_GH_PAGES_DIR}/phoronix-stats

            echo -e "${CYAN}Pushing new JSON file to gh-pages branch in ${GIT_USER}/phoronix-stats${NC}"
            git add ${JSON_FILE}
            git commit -m "Automated check-tests run on `(date +%F)`"
            git push 

            rm -rf ${TEMP_GH_PAGES_DIR}
        else    
            echo -e "${RED}Test Failed. Unable to locate ${JSON_FILE}${NC}"
        fi

        # if we have sucessfully created a JSON results file, push it to github
        pushJSON;
        
    else
        echo -e "${RED}Unable to pull latest -  .git folder does not exist in ${PHORONIX_ROOT} ${NC}"
    fi
else
    echo -e "${RED}${PHORONIX_ROOT} not found${NC}"
fi
    