# PostgreSQL Setup Guide for Arch Linux WSL

This guide will help you set up PostgreSQL directly in your Arch Linux WSL environment for your BLACK SEA STAR logistics website.

## 🐘 Prerequisites

- **Arch Linux WSL** environment
- **sudo** access
- **Internet connection** for package installation

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
# Make the script executable
chmod +x scripts/setup-arch-db.sh

# Run the setup script
./scripts/setup-arch-db.sh
```

This script will:
- ✅ Install PostgreSQL
- ✅ Initialize the database cluster
- ✅ Create the `logistics_db` database
- ✅ Create the `logistics_user` user
- ✅ Set up proper permissions
- ✅ Create `.env.local` file
- ✅ Test the connection

### Option 2: Manual Setup

If you prefer to set up manually:

```bash
# 1. Update system packages
sudo pacman -Syu

# 2. Install PostgreSQL
sudo pacman -S postgresql

# 3. Initialize database cluster
sudo -u postgres initdb -D /var/lib/postgres/data

# 4. Enable and start PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 5. Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE logistics_db;
CREATE USER logistics_user WITH PASSWORD 'logistics_password';
GRANT ALL PRIVILEGES ON DATABASE logistics_db TO logistics_user;
\c logistics_db;
GRANT ALL ON SCHEMA public TO logistics_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO logistics_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO logistics_user;
\q
EOF

# 6. Create .env.local file
cat > .env.local << EOF
DATABASE_URL="postgresql://logistics_user:logistics_password@localhost:5432/logistics_db"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@blacksea-star.com"
ADMIN_PASSWORD="admin123"
API_BASE_URL="http://localhost:3000/api"
EOF
```

## 📋 Available Commands

### NPM Scripts:
```bash
npm run db:start      # Start PostgreSQL service
npm run db:stop       # Stop PostgreSQL service
npm run db:restart    # Restart PostgreSQL service
npm run db:status     # Check PostgreSQL status
npm run db:setup      # Initialize database schema and seed data
```

### Direct Script Usage:
```bash
# Make script executable
chmod +x scripts/arch-db.sh

# Database management
./scripts/arch-db.sh start       # Start PostgreSQL
./scripts/arch-db.sh stop        # Stop PostgreSQL
./scripts/arch-db.sh restart     # Restart PostgreSQL
./scripts/arch-db.sh status      # Check status
./scripts/arch-db.sh connect     # Connect with psql
./scripts/arch-db.sh backup      # Create backup
./scripts/arch-db.sh restore     # Restore from backup
./scripts/arch-db.sh reset       # Reset database
./scripts/arch-db.sh test        # Test connection
```

## 🗄️ Database Details

### Connection Information:
- **Host:** localhost
- **Port:** 5432
- **Database:** logistics_db
- **Username:** logistics_user
- **Password:** logistics_password

### Database Features:
- ✅ **Native PostgreSQL** installation
- ✅ **Systemd service** management
- ✅ **Automatic startup** on boot
- ✅ **Data persistence** in `/var/lib/postgres/data`
- ✅ **Backup and restore** functionality
- ✅ **Direct psql access**

## 🔧 Database Management

### Start/Stop Database:
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Stop PostgreSQL
sudo systemctl stop postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check status
sudo systemctl status postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql
```

### Connect to Database:
```bash
# Using psql
PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db

# Or using the script
./scripts/arch-db.sh connect
```

### Backup Database:
```bash
# Create backup
PGPASSWORD=logistics_password pg_dump -h localhost -U logistics_user -d logistics_db > backup.sql

# Or using the script
./scripts/arch-db.sh backup
```

### Restore Database:
```bash
# Restore from backup
PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db < backup.sql

# Or using the script
./scripts/arch-db.sh restore backup.sql
```

## 🚀 Complete Setup Process

After running the setup script:

```bash
# 1. Setup database schema and seed data
npm run db:setup

# 2. Start your application
npm run dev

# 3. Access admin panel
# URL: http://localhost:3000/admin/login
# Email: admin@blacksea-star.com
# Password: admin123
```

## 🔧 Troubleshooting

### Common Issues:

1. **PostgreSQL not starting:**
   ```bash
   # Check logs
   sudo journalctl -u postgresql
   
   # Check if port is in use
   sudo netstat -tulpn | grep :5432
   ```

2. **Permission denied:**
   ```bash
   # Check PostgreSQL data directory permissions
   sudo chown -R postgres:postgres /var/lib/postgres
   sudo chmod 700 /var/lib/postgres/data
   ```

3. **Connection refused:**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Check PostgreSQL configuration
   sudo -u postgres psql -c "SHOW listen_addresses;"
   ```

4. **Database doesn't exist:**
   ```bash
   # Recreate database
   sudo -u postgres psql -c "CREATE DATABASE logistics_db;"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE logistics_db TO logistics_user;"
   ```

### Reset Everything:
```bash
# Stop PostgreSQL
sudo systemctl stop postgresql

# Remove data directory
sudo rm -rf /var/lib/postgres/data

# Reinitialize
sudo -u postgres initdb -D /var/lib/postgres/data

# Start PostgreSQL
sudo systemctl start postgresql

# Recreate database and user
sudo -u postgres psql << EOF
CREATE DATABASE logistics_db;
CREATE USER logistics_user WITH PASSWORD 'logistics_password';
GRANT ALL PRIVILEGES ON DATABASE logistics_db TO logistics_user;
\c logistics_db;
GRANT ALL ON SCHEMA public TO logistics_user;
\q
EOF
```

## 📊 Database Schema

The database includes these tables:
- `users` - Admin users
- `services` - Company services
- `certificates` - Company certificates
- `team_members` - Team member profiles
- `contact_messages` - Contact form submissions
- `content_pages` - Website content
- `analytics` - Website analytics
- `settings` - System settings

## 🎯 Next Steps

1. **Run setup:** `./scripts/setup-arch-db.sh`
2. **Initialize database:** `npm run db:setup`
3. **Start application:** `npm run dev`
4. **Access admin:** http://localhost:3000/admin/login

Your logistics website is now ready with a native PostgreSQL database! 🎉
