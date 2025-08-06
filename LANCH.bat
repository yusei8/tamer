@echo off
cd /d "%~dp0"

echo Vérification de la présence de Node.js et npm...
where npm >nul 2>nul
IF ERRORLEVEL 1 (
    echo [ERREUR] npm n'est pas installé. Installe Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

echo npm est installé.

:: Vérifie si node_modules existe
IF NOT EXIST node_modules (
    echo Installation des dépendances npm...
    npm install
    IF ERRORLEVEL 1 (
        echo [ERREUR] L'installation des modules npm a échoué.
        pause
        exit /b 1
    )
) ELSE (
    echo Les dépendances npm sont déjà installées.
)

:: Lancement de npm run dev
echo Lancement de npm run dev...
start cmd /k "npm run dev"

:: Lancement de node server.cjs
echo Lancement de node server.cjs...
start cmd /k "node server.cjs"

pause
