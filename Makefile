start-local-db:
	docker run -d -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:16-bookworm

# inspect-local-db:
# 	atlas schema inspect -u "postgres://postgres:password@localhost:5432/postgres?sslmode=disable"

# migrate-local-db:
# 	atlas schema apply -u "postgres://postgres:password@localhost:5432/postgres?sslmode=disable" --to "file://./schema/atlas.hcl"
