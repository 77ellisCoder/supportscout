#!/usr/bin/env bash

set -e

echo "Moving PR style files out of Expo Router app directory..."

# Create destination directory
mkdir -p styles/pr

# Move style files
mv app/pr/index.styles.ts \
   styles/pr/contacts.styles.ts

mv app/pr/campaign/campaign.styles.ts \
   styles/pr/campaign.styles.ts

mv app/pr/campaign/create.styles.ts \
   styles/pr/campaign-create.styles.ts

mv app/pr/campaigns/index.styles.ts \
   styles/pr/campaigns.styles.ts

echo "Updating imports..."

# PR Contacts
sed -i \
    's|from "./index.styles"|from "../../styles/pr/contacts.styles"|' \
    app/pr/index.tsx

# Campaign Review
sed -i \
    's|from "./campaign.styles"|from "../../../styles/pr/campaign.styles"|' \
    app/pr/campaign/\[id\].tsx

# Create Campaign
sed -i \
    's|from "./create.styles"|from "../../../styles/pr/campaign-create.styles"|' \
    app/pr/campaign/create.tsx

# Campaign List
sed -i \
    's|from "./index.styles"|from "../../../styles/pr/campaigns.styles"|' \
    app/pr/campaigns/index.tsx

echo ""
echo "Done."
echo ""
echo "Moved:"
echo "  app/pr/index.styles.ts"
echo "      -> styles/pr/contacts.styles.ts"
echo ""
echo "  app/pr/campaign/campaign.styles.ts"
echo "      -> styles/pr/campaign.styles.ts"
echo ""
echo "  app/pr/campaign/create.styles.ts"
echo "      -> styles/pr/campaign-create.styles.ts"
echo ""
echo "  app/pr/campaigns/index.styles.ts"
echo "      -> styles/pr/campaigns.styles.ts"
echo ""
echo "Checking for remaining *.styles.ts files under app/..."

find app -name "*.styles.ts" -print

echo ""
echo "If nothing appears above, Expo Router should no longer see style files as routes."