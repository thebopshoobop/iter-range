#!/usr/bin/env bash

# Ensure that the rendered documentation is up-to-date
npm run doc
git add README.md
