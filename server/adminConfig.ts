import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const configPath = path.join(process.cwd(), 'server', 'admin_config.json');

interface AdminConfig {
  adminEmail: string;
  notificationEmail: string;
}

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cesaresmero2@gmail.com';
const DEFAULT_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'cesaresmero2@gmail.com';

function loadConfig(): AdminConfig {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(data) as Partial<AdminConfig>;
      return {
        adminEmail: parsed.adminEmail || DEFAULT_ADMIN_EMAIL,
        notificationEmail: parsed.notificationEmail || DEFAULT_NOTIFICATION_EMAIL,
      };
    }
  } catch (err) {
    console.warn('[config] Failed to load admin config, using defaults:', err);
  }
  return {
    adminEmail: DEFAULT_ADMIN_EMAIL,
    notificationEmail: DEFAULT_NOTIFICATION_EMAIL,
  };
}

function saveConfig(config: AdminConfig) {
  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (err) {
    console.error('[config] Failed to save admin config:', err);
  }
}

let activeConfig = loadConfig();

export const adminConfig = {
  getAdminEmail() {
    return activeConfig.adminEmail;
  },
  getNotificationEmail() {
    return activeConfig.notificationEmail;
  },
  updateConfig(adminEmail: string, notificationEmail: string) {
    activeConfig = {
      adminEmail: adminEmail.trim().toLowerCase(),
      notificationEmail: notificationEmail.trim().toLowerCase(),
    };
    saveConfig(activeConfig);
  }
};
