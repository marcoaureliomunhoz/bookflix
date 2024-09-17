docker compose -f docker-compose-tests-db.yml up -d

sleep 10

npm run test:docker:test

docker compose -f docker-compose-tests-db.yml down -v