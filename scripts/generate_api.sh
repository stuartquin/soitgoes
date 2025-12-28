#!/bin/bash
docker exec -it soitgoes-soitgoes-1 python api/manage.py generateschema > openapi.yaml

docker run --rm \
  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i /local/openapi.yaml \
  -g typescript-fetch \
  -o /local/out/api \
  --additional-properties=typescriptThreePlus=true


docker exec -it soitgoes-soitgoes-1 python api/manage.py generateschema --format openapi-json > openapi.json
npx --yes @hey-api/openapi-ts@0.87.1 -p "@tanstack/react-query" -i openapi.json -o ui/src/apiv3


sudo chown -R ${USER}:${GROUP} out/
rm -r ui/src/api  2> /dev/null
mv out/api ui/src
