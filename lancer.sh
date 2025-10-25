#!/bin/bash

echo "========================================"
echo "   Gestion de Pool de Combat"
echo "========================================"
echo ""
echo "Démarrage de l'application..."
echo ""

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances nécessaires..."
    echo "Cela peut prendre quelques minutes la première fois."
    echo ""
    npm install
    echo ""
fi

echo "Lancement de l'application..."
echo ""
echo "L'application sera accessible à l'adresse:"
echo "http://localhost:5173"
echo ""
echo "Pour arrêter l'application, appuyez sur Ctrl+C"
echo ""

# Ouvrir le navigateur (si possible)
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173 &
elif command -v open > /dev/null; then
    open http://localhost:5173 &
fi

npm run dev
