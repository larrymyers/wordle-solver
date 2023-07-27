#!/usr/bin/env bash

# https://developers.cloudflare.com/pages/platform/build-configuration#environment-variables
if [[ -n $CF_PAGES && $CF_PAGES == "1" && -n $CF_PAGES_BRANCH && $CF_PAGES_BRANCH == "main" ]]; then
    npm run build
else
    DEV=true npm run build_preview
fi