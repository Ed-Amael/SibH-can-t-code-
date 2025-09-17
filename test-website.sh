#!/bin/bash

echo "🔍 Testing Electricity Pole Monitor Website"
echo "=========================================="

# Test 1: Check if the server is running
echo "✅ Test 1: Checking if server is running..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ Server is running and responding with 200"
else
    echo "❌ Server is not responding properly"
    exit 1
fi

# Test 2: Check API endpoint
echo "✅ Test 2: Testing API endpoint..."
API_RESPONSE=$(curl -s http://localhost:3000/api/poles?includeCables=true)
if echo "$API_RESPONSE" | grep -q "poles"; then
    echo "✅ API endpoint is working and returning pole data"
    
    # Count poles
    TOTAL_POLES=$(echo "$API_RESPONSE" | grep -o '"id":[0-9]*' | wc -l)
    DAMAGED_POLES=$(echo "$API_RESPONSE" | grep -o '"status":"damaged"' | wc -l)
    echo "✅ Found $TOTAL_POLES total poles, $DAMAGED_POLES damaged"
else
    echo "❌ API endpoint is not working correctly"
    exit 1
fi

# Test 3: Check if cables data is included
echo "✅ Test 3: Testing cables data..."
if echo "$API_RESPONSE" | grep -q "cables"; then
    CABLES_COUNT=$(echo "$API_RESPONSE" | grep -o '"id":[0-9]*,' | tail -3 | wc -l)
    echo "✅ Cables data is included, found $CABLES_COUNT cables"
else
    echo "❌ Cables data is missing"
    exit 1
fi

# Test 4: Check summary data
echo "✅ Test 4: Testing summary data..."
if echo "$API_RESPONSE" | grep -q "summary"; then
    echo "✅ Summary data is included"
else
    echo "❌ Summary data is missing"
    exit 1
fi

echo ""
echo "🎉 All tests passed! The website should be working correctly."
echo ""
echo "📍 Website URL: http://localhost:3000"
echo "📍 API URL: http://localhost:3000/api/poles?includeCables=true"
echo ""
echo "📊 Expected features:"
echo "   • Counter showing total poles (8)"
echo "   • Counter showing damaged poles (4)"  
echo "   • Counter showing cables needing replacement (2)"
echo "   • Interactive map with pole markers"
echo "   • Toggle to show/hide cables"
echo "   • Clickable markers with pole details"
echo "   • Legend explaining colors"