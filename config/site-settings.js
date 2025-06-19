// config/site-settings.js
// 🔥 EDIT THIS FILE: Update with your site details

module.exports = {
  // 🚨 REQUIRED: Update these settings for your site
  baseUrl: 'http://vapvarun.local', // Change to your site URL
  
  // Login credentials (required for authenticated pages)
  auth: {
    loginUrl: '/wp-admin',
    username: 'admin',     // Your WordPress admin username
    password: 'password'   // Your WordPress admin password
  },

  // Browser settings
  browser: {
    headless: 'new',                    // Use 'false' to see browser during testing
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--force-device-scale-factor=1',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ]
  },

  // Screenshot settings
  screenshot: {
    quality: 90,                        // Image quality (0-100)
    type: 'png',                        // Image format
    fullPage: true,                     // Capture full page height
    timeout: 60000                      // Page load timeout (ms)
  },

  // Timing settings (adjust for slower sites)
  delays: {
    afterPageLoad: 1500,                // Wait after page loads (ms)
    beforeScreenshot: 500,              // Wait before taking screenshot (ms)
    betweenPages: 300                   // Wait between page captures (ms)
  },

  // Visual comparison settings
  comparison: {
    threshold: 0.2,                     // Sensitivity (0.1 = very sensitive, 0.5 = less sensitive)
    includeAA: false,
    alpha: 0.1,
    aaColor: [255, 255, 0],            // Yellow for anti-aliasing differences
    diffColor: [255, 0, 255]           // Magenta for differences
  },

  // Performance settings
  performance: {
    blockResources: ['font', 'image'],  // Block these for faster loading
    enableCache: true,
    maxConcurrency: 2                   // Number of parallel captures (adjust for your machine)
  },

  // Local development settings
  local: {
    isLocal: true,
    ignoreCertErrors: false,            // Set to true for HTTPS local sites
    environment: 'development'
  }
};