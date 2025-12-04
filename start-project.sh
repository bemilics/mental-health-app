#!/bin/bash

# Script de inicio rápido para The Thought Cabinet
# Creado: 2025-12-04

clear
echo "╔════════════════════════════════════════════╗"
echo "║     🧠 THE THOUGHT CABINET 🧠             ║"
echo "║     Mental Health App - Proyecto          ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📁 Directorio: $(pwd)"
echo "📅 Fecha: $(date '+%Y-%m-%d %H:%M')"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Comandos disponibles:"
echo ""
echo "  1) npm start        → Iniciar servidor desarrollo (localhost:3000)"
echo "  2) npm run build    → Crear build de producción"
echo "  3) npm test         → Ejecutar tests"
echo "  4) git status       → Ver estado de Git"
echo ""
echo "📖 Documentación:"
echo ""
echo "  5) Ver memoria      → less PROJECT_MEMORY.md"
echo "  6) Editar memoria   → nano PROJECT_MEMORY.md"
echo ""
echo "🔧 Herramientas:"
echo ""
echo "  7) Abrir VS Code    → code ."
echo "  8) Salir            → exit"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Función para ejecutar comandos
run_command() {
    case $1 in
        1)
            echo "🚀 Iniciando servidor de desarrollo..."
            npm start
            ;;
        2)
            echo "🏗️  Creando build de producción..."
            npm run build
            ;;
        3)
            echo "🧪 Ejecutando tests..."
            npm test
            ;;
        4)
            echo "📊 Estado de Git:"
            git status
            ;;
        5)
            less PROJECT_MEMORY.md
            ;;
        6)
            nano PROJECT_MEMORY.md
            ;;
        7)
            code .
            ;;
        8)
            exit 0
            ;;
        *)
            echo "❌ Opción no válida"
            ;;
    esac
}

# Si se pasa un argumento, ejecutar directamente
if [ $# -gt 0 ]; then
    run_command $1
else
    # Menú interactivo
    read -p "Selecciona una opción (1-8): " choice
    run_command $choice
fi
