Write-Host "Creando la base de datos restaurante_db en PostgreSQL..."
$env:PGPASSWORD = "Jfrc11$$"
psql -h 34.61.243.71 -U postgres -d postgres -c "CREATE DATABASE restaurante_db;"
Write-Host "Base de datos creada con éxito."
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")