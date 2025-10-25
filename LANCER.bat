@echo off
echo ========================================
echo    Gestion de Pool de Combat
echo ========================================
echo.
echo Demarrage de l'application...
echo.

REM Vérifier si node_modules existe
if not exist "node_modules\" (
    echo Installation des dependances necessaires...
    echo Cela peut prendre quelques minutes la premiere fois.
    echo.
    call npm install
    echo.
)

echo Lancement de l'application...
echo.
echo L'application va s'ouvrir dans votre navigateur a l'adresse:
echo http://localhost:5173
echo.
echo Pour arreter l'application, fermez cette fenetre ou appuyez sur Ctrl+C
echo.

start http://localhost:5173
npm run dev
