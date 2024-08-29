FROM postgres:16-alpine
COPY customers.sql /docker-entrypoint-initdb.d/
RUN ls -l /docker-entrypoint-initdb.d