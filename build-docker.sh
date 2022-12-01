#!/bin/bash
docker rm -f web_cupcake_magdalena
docker build -t web_cupcake_magdalena .
docker run --name=web_cupcake_magdalena --rm -p1337:1337 -it web_cupcake_magdalena
