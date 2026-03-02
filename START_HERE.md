# 🚀 START HERE - Deploy to VPS

## 👋 Welcome!

This guide will help you deploy the Bilal School System to your VPS server at **bilal.skoolific.com**.

---

## ✅ What's Already Done

- ✅ New report card design implemented
- ✅ Backend API connected
- ✅ Database tables created
- ✅ Configuration files ready
- ✅ Port changed to 5011
- ✅ Database name changed to school_management10
- ✅ Domain set to bilal.skoolific.com

---

## 🎯 What You Need to Do

### STEP 1: Build the Frontend (2 minutes)

**On your computer:**

1. Double-click this file:
   ```
   DEPLOY_TO_VPS.bat
   ```

2. Wait for it to finish. You'll see:
   ```
   ✓ Frontend built successfully
   ```

3. This creates the `app/dist` folder with production files.

---

### STEP 2: Upload Files to VPS (10 minutes)

**You need to upload 2 folders:**

1. `backend/` → Upload to VPS at `/var/www/bilal-school/backend`
2. `app/dist/` → Upload to VPS at `/var/www/bilal-school/frontend`

**How to upload:**
- Use FileZilla (recommended): https://filezilla-project.org/
- Or use WinSCP: https://winscp.net/
- Or use command line (see UPLOAD_TO_VPS_CHECKLIST.md)

**Connection details:**
- Host: Your VPS IP address
- Username: root (or your username)
- Password: Your VPS password
- Port: 22
- Protocol: SFTP

---

### STEP 3: Setup VPS (30-60 minutes)

**Connect to your VPS:**
```bash
ssh root@YOUR_VPS_IP
```

**Follow the complete guide:**
- Open: `VPS_DEPLOYMENT_GUIDE.md`
- Start from Step 3 (Install Required Software)
- Follow each step carefully

**Quick summary:**
1. Install Node.js, PostgreSQL, Nginx, PM2
2. Create database: school_management10
3. Configure backend (.env file)
4. Get SSL certificate
5. Configure Nginx
6. Start backend with PM2
7. Test the website

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **START_HERE.md** | You are here! Quick start guide |
| **VPS_DEPLOYMENT_GUIDE.md** | Complete A-Z deployment instructions |
| **UPLOAD_TO_VPS_CHECKLIST.md** | File upload instructions |
| **DEPLOYMENT_STATUS.md** | Current status and overview |
| **DEPLOYMENT_ARCHITECTURE.md** | System architecture diagram |
| **DEPLOYMENT_QUICK_REFERENCE.md** | Quick commands reference |

---

## 🔐 Important Security Notes

**Before starting the backend on VPS, you MUST update these in the .env file:**

1. **Database Password**
   ```env
   DB_PASSWORD=YOUR_STRONG_PASSWORD
   ```

2. **JWT Secret** (generate new one)
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"
   ```
   Then paste in .env:
   ```env
   JWT_SECRET=YOUR_GENERATED_SECRET
   ```

3. **Email Settings** (if using email notifications)
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

---

## ✅ Success Checklist

You'll know deployment is successful when:

- [ ] Website loads at https://bilal.skoolific.com
- [ ] You see a green padlock (SSL working)
- [ ] You can login to admin panel
- [ ] You can view classes and students
- [ ] Report cards display correctly
- [ ] Backend API responds at https://bilal.skoolific.com/api/health

---

## 🆘 Need Help?

### Common Issues

**1. "Cannot connect to VPS"**
- Check VPS IP address is correct
- Check SSH port is 22
- Check firewall allows SSH (port 22)

**2. "Permission denied when uploading"**
```bash
# On VPS, run:
sudo mkdir -p /var/www/bilal-school
sudo chown -R $USER:$USER /var/www/bilal-school
```

**3. "Backend won't start"**
```bash
# Check logs:
pm2 logs bilal-backend --lines 50

# Common fix: Update .env passwords
nano /var/www/bilal-school/backend/.env
```

**4. "Database connection error"**
```bash
# Check PostgreSQL is running:
sudo systemctl status postgresql

# Test connection:
psql -U postgres -d school_management10
```

**5. "Website shows 502 Bad Gateway"**
```bash
# Check backend is running:
pm2 status

# Restart backend:
pm2 restart bilal-backend

# Check Nginx:
sudo systemctl status nginx
```

### Troubleshooting Commands

```bash
# View backend logs
pm2 logs bilal-backend

# View Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart everything
pm2 restart bilal-backend
sudo systemctl restart nginx

# Check all services
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

---

## 📞 Quick Reference

### Your Configuration

- **Domain:** bilal.skoolific.com
- **Backend Port:** 5011
- **Database Name:** school_management10
- **Database User:** postgres

### Important Paths on VPS

- Backend: `/var/www/bilal-school/backend`
- Frontend: `/var/www/bilal-school/frontend`
- Environment: `/var/www/bilal-school/backend/.env`
- Nginx Config: `/etc/nginx/sites-available/bilal-school`

### Useful Commands

```bash
# Restart backend
pm2 restart bilal-backend

# View logs
pm2 logs bilal-backend

# Check status
pm2 status

# Restart Nginx
sudo systemctl restart nginx

# Test Nginx config
sudo nginx -t

# Renew SSL certificate
sudo certbot renew
```

---

## 🎉 Ready to Start?

1. ✅ Read this file (you're doing it!)
2. 🔨 Run `DEPLOY_TO_VPS.bat` to build frontend
3. 📤 Upload files to VPS (see UPLOAD_TO_VPS_CHECKLIST.md)
4. ⚙️ Follow VPS_DEPLOYMENT_GUIDE.md from Step 3
5. 🎊 Test at https://bilal.skoolific.com

---

## 📋 Estimated Time

- Build frontend: 2 minutes
- Upload files: 10 minutes
- VPS setup (first time): 30-60 minutes
- Testing: 10 minutes

**Total: About 1 hour**

---

## 💡 Pro Tips

1. **Keep a backup** of your current .env file before making changes
2. **Test each step** before moving to the next
3. **Save your passwords** in a secure password manager
4. **Take screenshots** of successful steps
5. **Don't rush** - follow each step carefully

---

## 🎯 Next Steps After Deployment

Once deployed successfully:

1. **Setup automatic backups** (see VPS_DEPLOYMENT_GUIDE.md Step 12)
2. **Monitor logs regularly**
3. **Test all features** (login, reports, attendance, etc.)
4. **Train users** on the new report card system
5. **Setup monitoring** (optional: UptimeRobot, etc.)

---

**Good luck with your deployment! 🚀**

**Last Updated:** March 2, 2026  
**System Version:** Bilal School Management System  
**Domain:** bilal.skoolific.com
