#!/bin/bash

if [ "$1" == "production" ]; then
   ENVIRONMENT_TYPE=production
   ./node_modules/.bin/webpack --config config/webpack.production.config.js
   NODE_ENV=$ENVIRONMENT_TYPE ./node_modules/.bin/nodemon app.js
else
   ENVIRONMENT_TYPE=development
   NODE_ENV=$ENVIRONMENT_TYPE ./node_modules/.bin/nodemon app.js
fi
