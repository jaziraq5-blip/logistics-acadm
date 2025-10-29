#!/bin/bash

# PostgreSQL Management Script for Arch Linux
# Simple script to manage PostgreSQL for the logistics website

ACTION=$1

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

case "$ACTION" in
    start)
        print_status "Starting PostgreSQL service..."
        systemctl start postgresql
        print_success "PostgreSQL started!"
        ;;
    stop)
        print_status "Stopping PostgreSQL service..."
        systemctl stop postgresql
        print_success "PostgreSQL stopped!"
        ;;
    restart)
        print_status "Restarting PostgreSQL service..."
        systemctl restart postgresql
        print_success "PostgreSQL restarted!"
        ;;
    status)
        print_status "PostgreSQL service status:"
        systemctl status postgresql
        ;;
    connect)
        print_status "Connecting to database..."
        PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db
        ;;
    backup)
        print_status "Creating database backup..."
        timestamp=$(date +"%Y%m%d_%H%M%S")
        backup_file="backup_${timestamp}.sql"
        PGPASSWORD=logistics_password pg_dump -h localhost -U logistics_user -d logistics_db > "$backup_file"
        print_success "Backup created: $backup_file"
        ;;
    restore)
        if [ -z "$2" ]; then
            print_error "Please provide backup file: ./scripts/arch-db.sh restore backup_file.sql"
            exit 1
        fi
        print_status "Restoring database from $2..."
        PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db < "$2"
        print_success "Database restored from $2"
        ;;
    reset)
        print_error "This will delete all data in the database. Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            print_status "Resetting database..."
            PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
            print_success "Database reset complete!"
        else
            print_status "Database reset cancelled."
        fi
        ;;
    test)
        print_status "Testing database connection..."
        PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db -c "SELECT 'Database connection successful!' as status;"
        ;;
    *)
        echo "PostgreSQL Management Script for Arch Linux"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  start       Start PostgreSQL service"
        echo "  stop        Stop PostgreSQL service"
        echo "  restart     Restart PostgreSQL service"
        echo "  status      Show PostgreSQL service status"
        echo "  connect     Connect to database with psql"
        echo "  backup      Create database backup"
        echo "  restore     Restore database from backup file"
        echo "  reset       Reset database (delete all data)"
        echo "  test        Test database connection"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 backup"
        echo "  $0 restore backup_20231201_120000.sql"
        exit 1
        ;;
esac
