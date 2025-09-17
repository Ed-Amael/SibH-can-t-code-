#!/bin/bash

echo "🌍 Testing Tiruvanantapuram Map Update"
echo "======================================"

# Test 1: Check if server is running
echo "✅ Test 1: Checking if server is running..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Server is running and responding with 200"
else
    echo "❌ Server is not responding properly"
    exit 1
fi

# Test 2: Check API coordinates
echo "✅ Test 2: Testing Tiruvanantapuram coordinates..."
API_RESPONSE=$(curl -s http://localhost:3000/api/poles?includeCables=true)

# Check if coordinates are for Tiruvanantapuram (around 8.5°N, 76.9°E)
if echo "$API_RESPONSE" | grep -q '"lat":8\.5'; then
    echo "✅ Latitude coordinates updated to Tiruvanantapuram region (8.5°N)"
else
    echo "❌ Latitude coordinates not updated correctly"
    exit 1
fi

if echo "$API_RESPONSE" | grep -q '"lng":76\.9'; then
    echo "✅ Longitude coordinates updated to Tiruvanantapuram region (76.9°E)"
else
    echo "❌ Longitude coordinates not updated correctly"
    exit 1
fi

# Test 3: Count poles and cables
echo "✅ Test 3: Verifying data integrity..."
TOTAL_POLES=$(echo "$API_RESPONSE" | grep -o '"id":[0-9]*' | wc -l)
DAMAGED_POLES=$(echo "$API_RESPONSE" | grep -o '"status":"damaged"' | wc -l)
CABLES_NEEDING_REPLACEMENT=$(echo "$API_RESPONSE" | grep -o '"status":"needs_replacement"' | wc -l)

echo "✅ Found $TOTAL_POLES total poles"
echo "✅ Found $DAMAGED_POLES damaged poles"
echo "✅ Found $CABLES_NEEDING_REPLACEMENT cables needing replacement"

# Test 4: Verify expected counts
if [ "$TOTAL_POLES" -eq 8 ] && [ "$DAMAGED_POLES" -eq 4 ] && [ "$CABLES_NEEDING_REPLACEMENT" -eq 2 ]; then
    echo "✅ All data counts match expected values"
else
    echo "❌ Data counts don't match expected values"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Map successfully updated to Tiruvanantapuram!"
echo ""
echo "📍 New Location: Tiruvanantapuram, Kerala, India"
echo "📍 Coordinates: ~8.5241°N, 76.9366°E"
echo "📍 Website URL: http://localhost:3000"
echo ""
echo "🗺️ Map Features:"
echo "   • Centered on Tiruvanantapuram"
echo "   • 8 electricity poles with realistic Indian city coordinates"
echo "   • 3 cables connecting the poles"
echo "   • Color-coded markers and lines"
echo "   • Interactive map with zoom/pan"