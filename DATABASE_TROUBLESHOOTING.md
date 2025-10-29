# Database Troubleshooting Guide

## 🚨 **Current Issue: "Failed to add certificate"**

The error occurs because the database is not running or not properly connected. Here's how to fix it:

## 🔧 **Step 1: Check Database Status**

### **Option A: Using WSL Scripts**
```bash
# Check if PostgreSQL is running
sudo ./scripts/wsl-db.sh status

# If not running, start it
sudo ./scripts/wsl-db.sh start

# Test connection
npm run db:test
```

### **Option B: Manual PostgreSQL Commands**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check if database exists
sudo -u postgres psql -c "\l" | grep logistics_db
```

## 🔧 **Step 2: Initialize Database (if needed)**

```bash
# Create database and user (if not exists)
sudo -u postgres psql -c "CREATE DATABASE logistics_db;"
sudo -u postgres psql -c "CREATE USER logistics_user WITH PASSWORD 'logistics_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE logistics_db TO logistics_user;"

# Initialize schema
npm run db:init

# Seed with sample data
npm run db:seed
```

## 🔧 **Step 3: Test Database Connection**

### **Test API Endpoint**
Visit: `http://localhost:3000/api/test-db`

**Expected Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **Test with curl**
```bash
curl http://localhost:3000/api/test-db
```

## 🔧 **Step 4: Check Environment Variables**

Create `.env.local` file in project root:
```env
DATABASE_URL="postgresql://logistics_user:logistics_password@localhost:5432/logistics_db"
```

## 🔧 **Step 5: Update Database Schema (if needed)**

If you get column errors, run the migration:
```bash
# Connect to database
sudo -u postgres psql -d logistics_db

# Run the migration
\i scripts/add-image-url-to-services.sql

# Exit
\q
```

## 🚨 **Common Error Solutions**

### **Error: "relation does not exist"**
```bash
# Database tables not created
npm run db:init
```

### **Error: "connection refused"**
```bash
# PostgreSQL not running
sudo ./scripts/wsl-db.sh start
```

### **Error: "authentication failed"**
```bash
# Wrong credentials or user doesn't exist
sudo -u postgres psql -c "ALTER USER logistics_user PASSWORD 'logistics_password';"
```

### **Error: "database does not exist"**
```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE logistics_db;"
```

## 🔍 **Debug Steps**

### **1. Check PostgreSQL Service**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **2. Check Database Connection**
```bash
# Test connection
PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db -c "SELECT 1;"
```

### **3. Check Tables Exist**
```bash
PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db -c "\dt"
```

### **4. Check API Logs**
```bash
# Start development server and check console
npm run dev

# Look for database connection errors in terminal
```

## 🎯 **Quick Fix Commands**

### **Complete Database Setup**
```bash
# 1. Start PostgreSQL
sudo systemctl start postgresql

# 2. Create database and user
sudo -u postgres psql -c "CREATE DATABASE logistics_db;"
sudo -u postgres psql -c "CREATE USER logistics_user WITH PASSWORD 'logistics_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE logistics_db TO logistics_user;"

# 3. Initialize schema
npm run db:init

# 4. Seed data
npm run db:seed

# 5. Test connection
npm run db:test

# 6. Start development server
npm run dev
```

### **Test Certificate Creation**
1. Go to `http://localhost:3000/admin/login`
2. Login: `admin` / `admin123`
3. Go to Certificates → Add Certificate
4. Fill form and submit
5. Check browser console for detailed errors

## 📊 **Database Schema Verification**

### **Check if tables exist:**
```sql
-- Connect to database
PGPASSWORD=logistics_password psql -h localhost -U logistics_user -d logistics_db

-- List tables
\dt

-- Check certificates table structure
\d certificates

-- Check if data exists
SELECT COUNT(*) FROM certificates;
```

## 🔄 **Fallback Solution**

If database continues to fail, you can temporarily use localStorage:

1. **Comment out database calls** in API routes
2. **Use localStorage** for data persistence
3. **Fix database** when ready

## 📞 **Getting Help**

### **Check Logs:**
- **Browser Console**: F12 → Console tab
- **Server Logs**: Terminal where `npm run dev` is running
- **Database Logs**: `/var/log/postgresql/`

### **Common Issues:**
1. **PostgreSQL not installed**: `sudo pacman -S postgresql`
2. **Wrong port**: Default is 5432
3. **Firewall blocking**: Check WSL firewall settings
4. **Permission issues**: Run with sudo for database commands

## ✅ **Success Indicators**

You'll know it's working when:
- ✅ `npm run db:test` returns success
- ✅ `http://localhost:3000/api/test-db` returns success
- ✅ Certificate form submission works
- ✅ Data persists after page reload
- ✅ No errors in browser console

## 🚀 **Next Steps After Fix**

1. **Test all admin pages**: Certificates, Team, Services, Messages
2. **Upload images**: Test image upload functionality
3. **Verify persistence**: Reload pages to ensure data stays
4. **Check database**: Verify data is actually stored in PostgreSQL

Your database should be working after following these steps! 🎉
