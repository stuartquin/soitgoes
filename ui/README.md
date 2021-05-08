# Soitgoes experimental UI

## Generating Schema

```
docker-compose start
docker exec -it soitgoes_soitgoes_1 python manage.py generateschema > openapi.yaml

# Generate typescript
docker run --rm \
  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i /local/openapi.yaml \
  -g typescript-fetch \
  -o /local/ui/src/api --additional-properties=supportsES6=true --additional-properties=typescriptThreePlus=true
```
