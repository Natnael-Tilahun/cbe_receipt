#!/bin/bash

# Check if environment is passed
if [ -z "$1" ]; then
    echo "Usage: $0 [dev|uat|prod]"
    exit 1
fi

ENVIRONMENT="$1"

# Set path based on environment
case "$ENVIRONMENT" in
    dev)
        BUILD_FILE_PATH="/home/natnael-tilahun/Documents/Projectx files/receipt/dev"
        ;;
    uat)
        BUILD_FILE_PATH="/home/natnael-tilahun/Documents/Projectx files/receipt/uat"
        ;;
    prod)
        BUILD_FILE_PATH="/home/natnael-tilahun/Documents/Projectx files/receipt/prod"
        ;;
    *)
        echo "Invalid environment: $ENVIRONMENT"
        echo "Valid options: dev, uat, prod"
        exit 1
        ;;
esac

echo "=== Starting build process for $ENVIRONMENT ==="
npm run build || { echo "Build failed. Exiting."; exit 1; }

# Move the dist folder to target path
mv .output "$BUILD_FILE_PATH"

# Navigate to project directory
cd "$BUILD_FILE_PATH" || exit

# echo "=== Creating receipt folder ==="
# mkdir receipt

# echo "=== Moving build output ==="
# mv .output receipt

echo "=== Zipping receipt ==="
zip -r receipt.zip .output

echo "✅ Build and zip completed: $BUILD_FILE_PATH/receipt.zip"

echo "=== Cleaning old dist file ==="
rm -rf .output
rm -rf receipt
# rm -f receipt.zip
