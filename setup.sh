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

readme_template="## Development

## Building

## Deployment

## Issues

## Monitoring

## Team

## Dependencies"

printf "${bold}This script will edit the ${bcyan}.github/workflows/publish.yml${bold}, \
${bcyan}package.json${bold}, and ${bcyan}README.md${bold} files.\n\n"

printf "${bgreen}? ${bold}GitHub repository name (e.g. 'service-template'): ${cyan}"
read name
printf "${bgreen}? ${bold}README.md title (e.g. 'Service Template'): ${cyan}"
read title
printf "${bgreen}? ${bold}Repository description: ${cyan}"
read desc

printf "\n"

sed -i "" -e "s/service-template/${name}/g" package.json >/dev/null
if [ $? -eq 0 ]; then
  printf "${bgreen}${tick} ${bold}Changed project name, repository URL, and homepage URL in ${bcyan}package.json${bold}.\n"
else
  printf "${bred}${cross} ${bold}Could not edit ${bcyan}package.json${bold}.\n"
  exit 1
fi

sed -i "" -e "s/A template for LOOOP service repositories/${desc}/g" package.json >/dev/null
if [ $? -eq 0 ]; then
  printf "${bgreen}${tick} ${bold}Changed project description in ${bcyan}package.json${bold}.\n"
else
  printf "${bred}${cross} ${bold}Could not edit ${bcyan}package.json${bold}.\n"
  exit 1
fi

printf "# ${title}\n\n${desc}\n\n${readme_template}" > README.md
if [ $? -eq 0 ]; then
  printf "${bgreen}${tick} ${bold}Updated and cleaned up ${bcyan}README.md${bold}.\n"
else
  printf "${bred}${cross} ${bold}Could not edit ${bcyan}README.md${bold}.\n"
  exit 1
fi

sed -i "" -e "s/_SERVICE_NAME_/${name}/g" .github/workflows/publish.yml >/dev/null
if [ $? -eq 0 ]; then
  printf "${bgreen}${tick} ${bold}Changed S3 bucket folder and zip file name in ${bcyan}.github/workflows/publish.yml${bold}.\n"
else
  printf "${bred}${cross} ${bold}Could not edit ${bcyan}.github/workflows/publish.yml${bold}.\n"
  exit 1
fi

git rm --cached setup.sh >/dev/null
if [ $? -eq 0 ]; then
  printf "${bgreen}${tick} ${bold}Removed ${bcyan}setup.sh${bold} from Git\n"
else
  printf "${bred}${cross} ${bold}cross\n"
  exit 1
fi

printf "\n${bgreen}${asterisk} ${bold}All done. You can now commit and push!\n\n"