# 📸 WordPress Visual Testing

Automated visual regression testing for WordPress plugins like BuddyPress, WooCommerce, and LearnDash.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your site:**
   ```bash
   # Edit config/site-settings.js with your site details
   nano config/site-settings.js
   ```

3. **Test your setup:**
   ```bash
   npm run health-check
   ```

4. **Run your first test:**
   ```bash
   npm run test:buddypress:before
   ```

## 📋 Available Commands

### Health & Setup
- `npm run health-check` - Verify your site is accessible
- `npm run clean` - Remove all screenshots and reports
- `npm run help` - Show detailed command help

### Testing Commands
- `npm run test:buddypress:before` - Capture BuddyPress baseline
- `npm run test:buddypress:after` - Capture BuddyPress after changes
- `npm run test:woocommerce:before` - Capture WooCommerce baseline
- `npm run test:woocommerce:after` - Capture WooCommerce after changes
- `npm run test:learndash:before` - Capture LearnDash baseline
- `npm run test:learndash:after` - Capture LearnDash after changes

### Comparison & Reports
- `npm run compare` - Compare before/after screenshots
- `npm run report` - Open visual comparison report

### Complete Workflows
- `npm run full:buddypress` - Complete BuddyPress test cycle
- `npm run quick:buddypress` - Interactive BuddyPress testing

## ⚙️ Configuration

1. **Site Settings:** Edit `config/site-settings.js`
2. **Page Lists:** Choose from `config/buddypress-pages.js`, `config/woocommerce-pages.js`, etc.
3. **Devices:** Modify `config/devices.js` for different screen sizes
4. **Custom Pages:** Create your own in `config/custom-pages.js`

### Essential Configuration

**Edit `config/site-settings.js`:**
```javascript
module.exports = {
  baseUrl: 'http://your-site.local',  // Your site URL
  auth: {
    username: 'admin',                // Your admin username
    password: 'password'              // Your admin password
  }
  // ... other settings
};
```

## 🎯 Basic Workflow

1. **Capture baseline:**
   ```bash
   npm run test:buddypress:before
   ```

2. **Make your changes** (edit CSS, update plugins, etc.)

3. **Capture after changes:**
   ```bash
   npm run test:buddypress:after
   ```

4. **Compare results:**
   ```bash
   npm run compare
   ```

5. **View report:**
   ```bash
   npm run report
   ```

## 📊 Understanding Results

- **Green (Passed):** No significant visual changes
- **Yellow (Minor):** Small changes (1-5% difference)
- **Red (Major):** Significant changes (>5% difference)

Open the HTML report to see detailed before/after comparisons!

## 🐛 Troubleshooting

### Common Issues

**Site not accessible:**
```bash
npm run health-check
```

**Login failed:**
Check credentials in `config/site-settings.js`

**No screenshots captured:**
- Verify plugin is installed and pages exist
- Check if site is running locally

**Browser issues:**
```bash
DEBUG=true npm run test:buddypress:before
```

### Debug Mode

Run any command with `DEBUG=true` to see the browser:
```bash
DEBUG=true npm run test:buddypress:before
```

## 📁 Project Structure

```
wordpress-visual-testing/
├── config/                 # Configuration files
│   ├── site-settings.js    # Main site configuration
│   ├── devices.js          # Device/viewport settings
│   ├── buddypress-pages.js # BuddyPress page definitions
│   ├── woocommerce-pages.js# WooCommerce page definitions
│   ├── learndash-pages.js  # LearnDash page definitions
│   └── custom-pages.js     # Your custom page definitions
├── scripts/                # Testing scripts
│   ├── visual-tester.js    # Main testing engine
│   ├── run-test.js         # CLI test runner
│   ├── compare.js          # Image comparison
│   ├── health-check.js     # Setup verification
│   ├── cleanup.js          # File management
│   ├── open-report.js      # Report viewer
│   └── help.js             # Help system
├── screenshots/            # All screenshot files
│   ├── before/             # Baseline screenshots
│   ├── after/              # Post-change screenshots
│   └── diff/               # Difference images
└── reports/                # HTML and JSON reports
```

## 🎯 Plugin-Specific Testing

### BuddyPress
Tests activity feeds, member profiles, groups, messaging, and social features across all devices.

### WooCommerce
Tests shop pages, product displays, cart/checkout flows, and customer account areas.

### LearnDash
Tests course listings, lessons, quizzes, student dashboards, and progress tracking.

### Custom Pages
Define your own pages in `config/custom-pages.js` for any WordPress site.

## 🔧 Advanced Usage

### Test Specific Pages Only
Edit the page configuration files to comment out pages you don't need:

```javascript
// In config/buddypress-pages.js
public: [
  { name: 'activity-stream', path: '/activity/' },
  // { name: 'members-directory', path: '/members/' }, // Commented out
]
```

### Test Specific Devices Only
Edit `config/devices.js` to test fewer devices during development:

```javascript
module.exports = [
  { name: 'Mobile', viewport: { width: 375, height: 667 } },
  { name: 'Desktop', viewport: { width: 1366, height: 768 } }
  // Comment out other devices for faster testing
];
```

### Batch Testing
```bash
# Test multiple plugins in sequence
npm run test:buddypress:before
npm run test:woocommerce:before
npm run test:learndash:before

# Make your changes...

npm run test:buddypress:after
npm run test:woocommerce:after  
npm run test:learndash:after

npm run compare
```

## 🎉 Success Tips

1. **Start small** - Test a few critical pages first
2. **Use health checks** - Always run `npm run health-check` when