#!/usr/bin/env bash

# If the documentation template has been staged, make sure to generate and stage the rendered version
if [[ -n $(git status --short | grep 'M  .README.md') ]]; then
    npm run doc
    git add README.md
fi
