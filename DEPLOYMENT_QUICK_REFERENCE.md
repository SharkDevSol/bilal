# 🚀 Quick Deployment Reference

## Configuration Summary

| Item | Value |
|------|-------|
| **Domain** | bilal.skoolific.com |
| **Backend Port** | 5011 |
| **Database Name** | school_management10 |
| **Frontend URL** | https://bilal.skoolific.com |
| **Backend API** | https://bilal.skoolific.com/api |

---

## 📦 Files to Upload

```
Local                          →  VPS Location
─────────────────────────────────────────────────────────
backend/                       →  /var/www/bilal-school/backend/
app/dist/                      →  /var/www/bilal-school/frontend/
backend/.env.vps               →  /var/www/bilal-school/backend/.env
```

---

## ⚡ Quick Commands

### On Local Machine (Windows)
```bash
# 1. Build frontend
cd app
npm run build

# 2. Run deployment prep
DEPLOY_TO_VPS.bat
```

### On VPS (Linux)
```bash
# 1. Install dependencies
cd /var/www/bilal-school/backend
npm install --production

# 2. Setup environment
cp .env.vps .env
nano .env  # Update passwords!

# 3. Initialize database
node setup-report-card.js

# 4. Start with PM2
pm2 start server.js --name bilal-backend
pm2 save
pm2 startup

# 5. Configure Nginx
sudo nano /etc/nginx/sites-available/bilal-school
sudo ln -s /etc/nginx/sites-available/bilal-school /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. Get SSL certificate
sudo certbot --nginx -d bilal.skoolific.com
```

---

## 🔑 Critical Values to Update in .env

```bash
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE
JWT_SECRET=GENERATE_NEW_SECRET_HERE
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"
```

---

## ✅ Verification Checklist

- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend .env configured with correct values
- [ ] Database created: `school_management10`
- [ ] Backend starts: `node server.js`
- [ ] PM2 running: `pm2 status`
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Domain resolves: `ping bilal.skoolific.com`
- [ ] API responds: `curl https://bilal.skoolific.com/api/health`
- [ ] Website loads: Open https://bilal.skoolific.com

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check `pm2 logs bilal-backend` |
| Database error | Verify credentials in `.env` |
| 502 Bad Gateway | Backend not running, check `pm2 status` |
| SSL error | Run `sudo certbot renew` |
| Can't connect | Check firewall: `sudo ufw status` |

---

## 📞 Essential Commands

```bash
# View logs
pm2 logs bilal-backend --lines 100

# Restart services
pm2 restart bilal-backend
sudo systemctl restart nginx

# Check status
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql

# Database backup
pg_dump -U postgres school_management10 > backup.sql

# Update application
cd /var/www/bilal-school/backend
git pull
npm install
pm2 restart bilal-backend
```

---

## 📚 Full Documentation

See **VPS_DEPLOYMENT_GUIDE.md** for complete A-Z instructions.

---

**Ready to Deploy?** Run `DEPLOY_TO_VPS.bat` to start!
