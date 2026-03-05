# Super Admin Panel Guide

## 🔐 Access Credentials

### Super Admin Login
- **Email:** admin@startup.com
- **Password:** admin123

### Demo User Accounts
- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123
- **Email:** mike@example.com | **Password:** password123
- **Email:** sarah@example.com | **Password:** password123

## 📊 Dashboard Features

### 1. Overview Tab
- **Real-time Statistics**
  - Total registered users
  - Active vs inactive users
  - Business category distribution
  - New registrations (last 30 days)

- **Recent Registrations**
  - Shows latest 5 user registrations
  - Quick status overview
  - Direct access to user profiles

### 2. User Management Tab
- **Advanced Search & Filtering**
  - Search by name, email, phone, or business category
  - Filter by account status (Active/Inactive)
  - Filter by business category
  - Real-time results

- **User Table Features**
  - Sortable columns
  - Pagination (10 users per page)
  - Detailed user information display
  - Status indicators with color coding

- **Admin Actions Per User**
  - **View Details** - Complete user profile in modal
  - **Edit Profile** - Update user information
  - **Activate/Deactivate** - Toggle account status
  - **Reset Password** - Send password reset link
  - **Delete User** - Permanently remove user (with confirmation)
  - **Send Email** - Direct communication

- **Bulk Operations**
  - Export user data to CSV
  - Refresh data from server
  - Filter and search across all users

### 3. Analytics Tab
- **Business Category Distribution**
  - Visual representation of user categories
  - Percentage breakdown
  - Category-wise user counts

- **User Status Overview**
  - Active vs inactive user statistics
  - Growth trends
  - Registration patterns

## 🛠️ Super Admin Capabilities

### User Management
- ✅ View all registered users
- ✅ Search and filter users
- ✅ Activate/deactivate user accounts
- ✅ Delete user accounts
- ✅ View detailed user profiles
- ✅ Export user data
- ✅ Reset user passwords
- ✅ Send emails to users

### System Administration
- ✅ Monitor system statistics
- ✅ Track user growth
- ✅ Analyze business categories
- ✅ Monitor active/inactive users
- ✅ Real-time data refresh

### Security Features
- ✅ Role-based access control
- ✅ JWT token authentication
- ✅ Secure API endpoints
- ✅ Action confirmations for destructive operations
- ✅ Audit logging

## 🔄 API Integration

### Backend Endpoints Used
```
GET  /admin/users           - Fetch all users
GET  /admin/users/active    - Fetch active users
GET  /admin/users/search    - Search users
GET  /admin/stats           - Dashboard statistics
PUT  /admin/users/{id}/status - Update user status
DELETE /admin/users/{id}    - Delete user
```

### Real-time Features
- Automatic token refresh
- Real-time status updates
- Live search results
- Instant data synchronization

## 📈 Usage Analytics

### Dashboard Metrics
- **Total Users** - Complete user count
- **Active Users** - Currently active accounts
- **Business Categories** - Unique business types
- **New Registrations** - Last 30 days growth

### User Insights
- Registration trends
- Category popularity
- User engagement levels
- Account status distribution

## 🚀 Quick Actions

### Daily Admin Tasks
1. **Monitor New Users** - Check recent registrations
2. **Review Inactive Accounts** - Follow up with inactive users
3. **Category Analysis** - Track business type trends
4. **User Support** - Handle account issues

### Security Monitoring
1. **Account Status** - Monitor suspicious activities
2. **Failed Logins** - Track authentication issues
3. **Data Export** - Regular backup procedures
4. **User Cleanup** - Remove inactive accounts

## 📋 Best Practices

### User Management
- Always confirm before deleting users
- Use deactivation instead of deletion when possible
- Keep detailed logs of admin actions
- Regular data exports for backup

### Security
- Change default admin password
- Regular token rotation
- Monitor user activities
- Implement proper access controls

### Performance
- Use filters to manage large user lists
- Regular database maintenance
- Monitor system performance
- Optimize search queries

## 🔧 Troubleshooting

### Common Issues
1. **Users not loading** - Check API connection
2. **Search not working** - Verify search filters
3. **Actions failing** - Check user permissions
4. **Export issues** - Browser download settings

### Error Handling
- All actions include proper error messages
- Failed operations are logged
- Users receive feedback on actions
- Graceful degradation for API failures

## 📞 Support

### Backend Integration
- Spring Boot REST API
- MySQL database
- JWT authentication
- Role-based authorization

### Frontend Features
- React with TypeScript
- Tailwind CSS styling
- ShadCN UI components
- Real-time updates

### Demo Mode
- Works without backend running
- Mock data for testing
- All features functional
- Easy development setup