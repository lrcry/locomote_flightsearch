#!/bin/bash

# install dependencies
npm i;

# config
source appconfig.env;

# startup restapi
node server.js;