@echo off
echo Creando la base de datos restaurante_db en PostgreSQL...
psql -h 34.61.243.71 -U postgres -d postgres -c "CREATE DATABASE restaurante_db;"
echo Base de datos creada con éxito.
pause