module.exports = {
  apps: [
    {
      name: 'gcme-api',
      script: 'dist/main.js',
      cwd: '/root/gcme-give/api',
      instances: 1,
      exec_mode: 'fork',
      env_file: '/root/gcme-give/deployment/configs/api.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      log_file: '/var/log/pm2/gcme-api.log',
      out_file: '/var/log/pm2/gcme-api-out.log',
      error_file: '/var/log/pm2/gcme-api-error.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      min_uptime: '10s',
      max_restarts: 10
    },
    {
      name: 'gcme-web',
      script: '.next/standalone/web/server.js',
      cwd: '/root/gcme-give/web',
      instances: 1,
      exec_mode: 'cluster',
      env_file: '/root/gcme-give/deployment/configs/web.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      log_file: '/var/log/pm2/gcme-web.log',
      out_file: '/var/log/pm2/gcme-web-out.log',
      error_file: '/var/log/pm2/gcme-web-error.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      min_uptime: '10s',
      max_restarts: 10
    }
  ]
};
