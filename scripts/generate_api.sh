#!/bin/bash
docker exec -it soitgoes-soitgoes-1 python api/manage.py generateschema --file=openapi.yaml

mv api/openapi.yaml .

docker run --rm \
  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i /local/openapi.yaml \
  -g typescript-fetch \
  -o /local/out/api \
  --additional-properties=typescriptThreePlus=true

sudo chown -R ${USER}:${GROUP} out/
rm -r ui/src/api  2> /dev/null
mv out/api ui/src
