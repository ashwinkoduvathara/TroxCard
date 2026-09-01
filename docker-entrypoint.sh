#!/bin/sh
set -e

echo "Starting embedded MongoDB service..."
mkdir -p /data/db
mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db --bind_ip_all

echo "Waiting for MongoDB to be ready..."
until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 1
done
echo "MongoDB is ready."

echo "Starting TroxCard App..."
export MONGODB_URI="${MONGODB_URI:-mongodb://127.0.0.1:27017/troxcard}"
exec node server.mjs
