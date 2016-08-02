#/bin/sh

set -e
echo "Getting image size..."
IMAGE_SIZE=$(docker run --entrypoint=/bin/sh $IMAGE:$VERSION -c 'du -s / 2>/dev/null | cut -f1')
echo "[{\"eventType\": \"imageSize\", \"image\": \"$IMAGE\", \"version\": \"$VERSION\", \"size\": $IMAGE_SIZE}]" > /tmp/insights.json
cat /tmp/insights.json

echo "Sending data to insights..."
cat /tmp/insights.json | curl -d @- -X POST -H "Content-Type: application/json" -H "X-Insert-Key: G3f-bY7a18lj9DfnJtyijd9BofZamNxI" https://insights-collector.newrelic.com/v1/accounts/1136088/events

