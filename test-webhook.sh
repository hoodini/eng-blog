#!/bin/bash
# Test webhook script for Make.com integration
# Replace YOUR_BLOG_URL with your actual Vercel deployment URL

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BLOG_URL="${1:-http://localhost:3000}"
API_SECRET="7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a"

echo "Testing webhook at: $BLOG_URL/api/publish"
echo "---"

# Test 1: Valid request
echo -e "${GREEN}Test 1: Valid request with API key${NC}"
curl -X POST "$BLOG_URL/api/publish" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_SECRET" \
  -d '{
    "title": "Test Post from Webhook",
    "content": "# Hello World\n\nThis is a test post created via the webhook API.\n\n## Features\n\n- Automated posting\n- Markdown support\n- Tag filtering\n\nPretty cool!",
    "excerpt": "Testing the automated blog posting system.",
    "tags": ["test", "automation", "ai"]
  }'
echo -e "\n---\n"

# Test 2: Missing API key
echo -e "${RED}Test 2: Missing API key (should fail)${NC}"
curl -X POST "$BLOG_URL/api/publish" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Should Fail",
    "content": "This should not work"
  }'
echo -e "\n---\n"

# Test 3: Wrong API key
echo -e "${RED}Test 3: Wrong API key (should fail)${NC}"
curl -X POST "$BLOG_URL/api/publish" \
  -H "Content-Type: application/json" \
  -H "x-api-key: wrong-key-12345" \
  -d '{
    "title": "Should Fail",
    "content": "This should not work"
  }'
echo -e "\n---\n"

# Test 4: Missing required fields
echo -e "${RED}Test 4: Missing title (should fail)${NC}"
curl -X POST "$BLOG_URL/api/publish" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_SECRET" \
  -d '{
    "content": "Content without title"
  }'
echo -e "\n---\n"

# Test 5: Health check
echo -e "${GREEN}Test 5: Health check (GET request)${NC}"
curl -X GET "$BLOG_URL/api/publish"
echo -e "\n---\n"

echo "Tests completed!"
