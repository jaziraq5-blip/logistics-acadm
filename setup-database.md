# Database Setup Instructions

## 1. Start PostgreSQL Database

Run these commands in your WSL terminal:

```bash
# Start PostgreSQL
sudo ./scripts/wsl-db.sh start

# Check if it's running
sudo ./scripts/wsl-db.sh status

# Test connection
npm run db:test
```

## 2. Initialize Database (if not already done)

```bash
# Initialize database schema
npm run db:init

# Seed with initial data
npm run db:seed
```

## 3. Start the Development Server

```bash
npm run dev
```

## 4. Test Admin Functionality

1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Test the following pages:
   - **Certificates**: Add/delete certificates
   - **Team Members**: Add/delete team members  
   - **Services**: Add/delete services
   - **Messages**: View/delete contact messages

## 5. Database Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: logistics_db
- **Username**: logistics_user
- **Password**: logistics_password

## 6. API Endpoints

The following API endpoints are now available:

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create new certificate
- `GET /api/certificates/[id]` - Get specific certificate
- `PUT /api/certificates/[id]` - Update certificate
- `DELETE /api/certificates/[id]` - Delete certificate

### Team Members
- `GET /api/team` - Get all team members
- `POST /api/team` - Create new team member
- `GET /api/team/[id]` - Get specific team member
- `PUT /api/team/[id]` - Update team member
- `DELETE /api/team/[id]` - Delete team member

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `GET /api/services/[id]` - Get specific service
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service

### Contact Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create new message
- `GET /api/messages/[id]` - Get specific message
- `PUT /api/messages/[id]` - Update message read status
- `DELETE /api/messages/[id]` - Delete message

## 7. Troubleshooting

If you encounter issues:

1. **Database not running**: Run `sudo ./scripts/wsl-db.sh start`
2. **Connection failed**: Check if PostgreSQL is running on port 5432
3. **Permission denied**: Make sure you're running with sudo for database commands
4. **API errors**: Check browser console for detailed error messages

## 8. Data Persistence

All admin data is now stored in PostgreSQL database:
- ✅ **Certificates** - Stored in `certificates` table
- ✅ **Team Members** - Stored in `team_members` table
- ✅ **Services** - Stored in `services` table
- ✅ **Contact Messages** - Stored in `contact_messages` table

Data will persist across:
- Page reloads
- Browser restarts
- Server restarts
- Database restarts (if properly configured)
