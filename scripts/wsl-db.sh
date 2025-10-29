#!/bin/bash

# PostgreSQL Management Script for WSL (without systemd)
# This script manages PostgreSQL in WSL environment

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

# Check if PostgreSQL is running
check_postgres() {
    if pgrep -x "postgres" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Start PostgreSQL manually (WSL way)
start_postgres() {
    if check_postgres; then
        print_status "PostgreSQL is already running"
        return 0
    fi
    
    print_status "Starting PostgreSQL..."
    
    # Start PostgreSQL in background
    sudo -u postgres postgres -D /var/lib/postgres/data > /var/log/postgresql.log 2>&1 &
    
    # Wait a moment for it to start
    sleep 3
    
    if check_postgres; then
        print_success "PostgreSQL started successfully!"
    else
        print_error "Failed to start PostgreSQL"
        return 1
    fi
}

# Stop PostgreSQL
stop_postgres() {
    if ! check_postgres; then
        print_status "PostgreSQL is not running"
        return 0
    fi
    
    print_status "Stopping PostgreSQL..."
    pkill -x postgres
    sleep 2
    
    if ! check_postgres; then
        print_success "PostgreSQL stopped successfully!"
    else
        print_error "Failed to stop PostgreSQL"
        return 1
    fi
}

case "$ACTION" in
    start)
        start_postgres
        ;;
    stop)
        stop_postgres
        ;;
    restart)
        stop_postgres
        sleep 2
        start_postgres
        ;;
    status)
        if check_postgres; then
            print_success "PostgreSQL is running"
            echo "Processes:"
            pgrep -x postgres | xargs ps -p
        else
            print_error "PostgreSQL is not running"
        fi
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
            print_error "Please provide backup file: ./scripts/wsl-db.sh restore backup_file.sql"
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
        echo "PostgreSQL Management Script for WSL"
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
