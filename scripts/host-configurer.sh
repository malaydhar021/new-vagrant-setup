#!/usr/bin/env bash

cd client
npm i
npm run build:dev
cd ../widget
npm i
npm run build:dev

sudo bash -c 'cat >> /etc/hosts <<- "EOF"

# Sticky Reviews Local Development
192.168.15.10   api.local.usestickyreviews.com
192.168.15.10   app.local.usestickyreviews.com
192.168.15.10   lib.local.usestickyreviews.com
192.168.15.10   www.local.usestickyreviews.com
EOF
'
