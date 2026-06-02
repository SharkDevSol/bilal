#!/usr/bin/env python3
import paramiko
import sys

# VPS credentials
hostname = '76.13.48.245'
username = 'root'
password = 'V@gSWi)Po712@TaWR3r9'
remote_path = '/var/www/skoolific/iqrab3/APP/dist/index.html'
local_path = 'APP/dist/index.html'

try:
    print("🔐 Connecting to VPS...")
    
    # Create SSH client
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    
    print("📤 Uploading index.html...")
    
    # Create SFTP client
    sftp = ssh.open_sftp()
    sftp.put(local_path, remote_path)
    sftp.close()
    
    print("✅ File uploaded successfully!")
    
    print("🔄 Reloading Nginx...")
    stdin, stdout, stderr = ssh.exec_command('systemctl reload nginx')
    exit_status = stdout.channel.recv_exit_status()
    
    if exit_status == 0:
        print("✅ Nginx reloaded successfully!")
    else:
        print(f"⚠️ Nginx reload returned status {exit_status}")
        print(stderr.read().decode())
    
    ssh.close()
    
    print("\n" + "="*60)
    print("🎉 DEPLOYMENT COMPLETE!")
    print("="*60)
    print("\n📋 User must now:")
    print("1. Clear browser cache (Ctrl+Shift+Delete)")
    print("2. Close ALL tabs for iqrab3.skoolific.com")
    print("3. Restart browser completely")
    print("4. Open iqrab3.skoolific.com in fresh tab")
    print("5. Check console for: 📊 Students with existing marks:")
    print("6. Test: Fill marks → Save → Refresh → Should stay locked ✅")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
