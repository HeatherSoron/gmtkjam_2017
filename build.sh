#!/bin/bash

./gen-includes > jade/scripts.jade
./node_modules/jade/bin/jade.js index.jade
