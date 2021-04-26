#!/usr/bin/env bash

bold='\033[0m\033[1m'     # Bold
normal='\033[0m'          # Normal
cyan='\033[0;36m'         # Regular cyan
bred='\033[1;31m'         # Bold red
bgreen='\033[1;32m'       # Bold green
bcyan='\033[1;36m'        # Bold cyan

tick='\xE2\x9C\x94'
cross='\xE2\x9C\x98'
asterisk='\xE2\x9C\xA4'

printf "${bold}This script will configure the files in the repository for you.\n\n"

GIT_URL=$(git config --get remote.origin.url)
name=$(echo $GIT_URL | sed 's/.*\/\(.*\)\.git/\1/g')

printf "${bgreen}? ${bold}README.md title (e.g. 'Service Name'): ${cyan}"
read title
printf "${bgreen}? ${bold}Pulumi Component Name (e.g. 'ServiceName'): ${cyan}"
read nameProper
printf "${bgreen}? ${bold}Service description: ${cyan}"
read desc

printf "\n"

# replace a pattern in a file and print a description if it is successful
replaceInFile() {
  FILE=$1
  PATTERN=$2
  DESCRIPTION=$3

  sed -i "" -e "${PATTERN}" $FILE >/dev/null
  if [ $? -eq 0 ]; then
    printf "${bgreen}${tick} ${bold}${DESCRIPTION} in ${bcyan}${FILE}${bold}.\n"
  else
    printf "${bred}${cross} ${bold}Could not edit ${bcyan}${FILE}${bold}.\n"
    exit 1
  fi
}

for f in "package.json" "src/package.json" "deploy/package.json"; do
  replaceInFile $f "s/service-template/${name}/g" "Changed project name, repository URL, and homepage URL"
  replaceInFile $f "s/A template for LOOOP service repositories/${desc}/g" "Changed project description"
done

mv -f README.service.md README.md
if [ $? -eq 0 ]; then
  printf "${bgreen}${tick} ${bold}Updated ${bcyan}README.md${bold}.\n"
else
  printf "${bred}${cross} ${bold}Could not edit ${bcyan}README.md${bold}.\n"
  exit 1
fi

replaceInFile "README.md" "s/service-template/${name}/g" "Service Name"
replaceInFile "README.md" "s/service-title/${title}/g" "Service Title"
replaceInFile "README.md" "s/service-description/${desc}/g" "Service Description"
replaceInFile "./deploy/index.ts" "s/service-template/${name}/g" "Service Name"
replaceInFile "./deploy/index.ts" "s/ServiceTemplate/${nameProper}/g" "Pulumi Component Name"
replaceInFile "README.md" "s/ServiceTemplate/${nameProper}/g" "Pulumi Component Name"

# remove npm command to init-template and the init-template script itselt

rm bin/init-template.sh

replaceInFile "package.json" "/init-template/d" "Remove init-template script"

printf "\n${bgreen}${asterisk} ${bold}All done. You can now commit and push!\n\n"