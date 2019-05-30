#!/usr/bin/env bash

cd client
npm i
npm run build:local
cd ../widget
npm i
npm run build:dev

sudo bash -c 'cat >> /etc/hosts <<- "EOF"

# Sticky Reviews Local Development
192.168.15.68   api.local.usestickyreviews.com
192.168.15.68   app.local.usestickyreviews.com
192.168.15.68   lib.local.usestickyreviews.com
192.168.15.68   www.local.usestickyreviews.com
192.168.15.68   hook.local.usestickyreviews.com
EOF
'
