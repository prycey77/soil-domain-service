#!/usr/bin/env bash

bold='\033[0m\033[1m'     # Bold
normal='\033[0m'          # Normal
cyan='\033[0;36m'         # Regular cyan
bred='\033[1;31m'         # Bold red
bgreen='\033[1;32m'       # Bold green
bcyan='\033[1;36m'        # Bold cyan

tick='\xE2\x9C\x94'
cross='\xE2\x9C\x98'

printf "${bold}This script will edit the ${bcyan}.github/workflows/publish.yml${bold}, \
${bcyan}package.json${bold}, and ${bcyan}README.md${bold} files.\n\n"

printf "${bgreen}? ${bold}GitHub repository name (e.g. 'service-template'): ${cyan}"
read name
printf "${bgreen}? ${bold}README.md title (e.g. 'Service Template'): ${cyan}"
read title
printf "${bgreen}? ${bold}Repository description: ${cyan}"
read desc

printf "\n"

ls >/dev/null
if [ $? -eq 0 ]; then
  printf "${bgreen}${tick} ${bold}check mark\n"
else
  printf "${bred}${cross} ${bold}cross\n"
  exit 1
fi

printf "\n"