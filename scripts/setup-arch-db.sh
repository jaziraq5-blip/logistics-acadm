#!/bin/bash

# PostgreSQL Setup Script for Arch Linux WSL
# This script installs and configures PostgreSQL for the logistics website

set -e

echo "🐘 Setting up PostgreSQL on Arch Linux..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_warning "Running as root. This is fine for WSL environments."
fi

# Update system packages
print_status "Updating system packages..."
pacman -Syu --noconfirm

# Install PostgreSQL
print_status "Installing PostgreSQL..."
pacman -S --noconfirm postgresql

# Initialize database cluster
print_status "Initializing PostgreSQL database cluster..."
initdb -D /var/lib/postgres/data

# Enable and start PostgreSQL service
print_status "Enabling and starting PostgreSQL service..."
systemctl enable postgresql
systemctl start postgresql

# Wait for PostgreSQL to start
print_status "Waiting for PostgreSQL to start..."
sleep 3

# Create database and user
print_status "Creating database and user..."
psql -U postgres << EOF
-- Create database
CREATE DATABASE logistics_db;

-- Create user
CREATE USER logistics_user WITH PASSWORD 'logistics_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE logistics_db TO logistics_user;

-- Connect to the database and grant schema privileges
\c logistics_db;
GRANT ALL ON SCHEMA public TO logistics_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO logistics_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO logistics_user;

-- Exit
\q
EOF

print_success "PostgreSQL setup completed!"

# Test connection
print_status "Testing database connection..."
PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    print_success "Database connection test passed!"
else
    print_error "Database connection test failed!"
    exit 1
fi

# Create .env.local file
print_status "Creating .env.local file..."
cat > .env.local << EOF
# PostgreSQL Database Configuration
DATABASE_URL="postgresql://logistics_user:logistics_password@localhost:5432/logistics_db"

# Next.js Configuration
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Admin Configuration
ADMIN_EMAIL="admin@blacksea-star.com"
ADMIN_PASSWORD="admin123"

# API Configuration
API_BASE_URL="http://localhost:3000/api"
EOF

print_success ".env.local file created!"

# Display connection information
echo ""
print_success "🎉 PostgreSQL setup completed successfully!"
echo ""
echo "📋 Database Connection Details:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: logistics_db"
echo "   Username: logistics_user"
echo "   Password: logistics_password"
echo ""
echo "🔧 Available Commands:"
echo "   npm run db:start     # Start PostgreSQL service"
echo "   npm run db:stop      # Stop PostgreSQL service"
echo "   npm run db:restart   # Restart PostgreSQL service"
echo "   npm run db:status    # Check PostgreSQL status"
echo "   npm run db:setup     # Initialize database schema and seed data"
echo ""
echo "🚀 Next Steps:"
echo "   1. Run: npm run db:setup"
echo "   2. Run: npm run dev"
echo "   3. Access admin panel at: http://localhost:3000/admin/login"
echo "   4. Login with: admin@blacksea-star.com / admin123"
echo ""
