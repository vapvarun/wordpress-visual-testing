// scripts/help.js
// Display comprehensive help information

const chalk = require('chalk');
const settings = require('../config/site-settings');

function showHelp() {
  console.log(chalk.bold.blue('\n📸 WordPress Visual Testing - Command Reference\n'));
  
  console.log(chalk.bold.green('🚀 GETTING STARTED'));
  console.log(chalk.blue('Health Check:'));
  console.log(chalk.gray('  npm run health-check     '), 'Verify your setup is ready');
  console.log();
  
  console.log(chalk.blue('First Time Setup:'));
  console.log(chalk.gray('  1. Edit config/site-settings.js with your site details'));
  console.log(chalk.gray('  2. npm run health-check'));
  console.log(chalk.gray('  3. npm run test:buddypress:before'));
  console.log(chalk.gray('  4. Make your CSS changes'));
  console.log(chalk.gray('  5. npm run test:buddypress:after'));
  console.log(chalk.gray('  6. npm run compare'));
  console.log(chalk.gray('  7. npm run report'));
  console.log();

  console.log(chalk.bold.green('🧪 TESTING COMMANDS'));
  console.log(chalk.blue('BuddyPress:'));
  console.log(chalk.gray('  npm run test:buddypress:before    '), 'Capture baseline screenshots');
  console.log(chalk.gray('  npm run test:buddypress:after     '), 'Capture after-change screenshots');
  console.log(chalk.gray('  npm run full:buddypress           '), 'Complete test cycle');
  console.log(chalk.gray('  npm run quick:buddypress          '), 'Interactive testing');
  console.log();

  console.log(chalk.blue('WooCommerce:'));
  console.log(chalk.gray('  npm run test:woocommerce:before   '), 'Capture WooCommerce baseline');
  console.log(chalk.gray('  npm run test:woocommerce:after    '), 'Capture after changes');
  console.log(chalk.gray('  npm run full:woocommerce          '), 'Complete WooCommerce cycle');
  console.log(chalk.gray('  npm run quick:woocommerce         '), 'Interactive WooCommerce testing');
  console.log();

  console.log(chalk.blue('LearnDash:'));
  console.log(chalk.gray('  npm run test:learndash:before     '), 'Capture LearnDash baseline');
  console.log(chalk.gray('  npm run test:learndash:after      '), 'Capture after changes');
  console.log(chalk.gray('  npm run full:learndash            '), 'Complete LearnDash cycle');
  console.log();

  console.log(chalk.blue('Custom Pages:'));
  console.log(chalk.gray('  npm run test:custom:before        '), 'Test custom page configuration');
  console.log(chalk.gray('  npm run test:custom:after         '), 'Test custom pages after changes');
  console.log();

  console.log(chalk.bold.green('📊 ANALYSIS COMMANDS'));
  console.log(chalk.gray('  npm run compare           '), 'Compare before/after screenshots');
  console.log(chalk.gray('  npm run report            '), 'Open visual comparison report');
  console.log();

  console.log(chalk.bold.green('🧹 MAINTENANCE COMMANDS'));
  console.log(chalk.gray('  npm run clean             '), 'Remove all screenshots and reports');
  console.log(chalk.gray('  npm run clean before      '), 'Remove only "before" screenshots');
  console.log(chalk.gray('  npm run clean after       '), 'Remove only "after" screenshots');
  console.log(chalk.gray('  npm run clean reports     '), 'Remove only reports');
  console.log();

  console.log(chalk.bold.green('🔧 CONFIGURATION'));
  console.log(chalk.blue('Site Settings:'));
  console.log(chalk.gray('  File: config/site-settings.js'));
  console.log(chalk.gray('  Current site: '), chalk.cyan(settings.baseUrl));
  console.log(chalk.gray('  Authentication: '), settings.auth.username ? chalk.green('Configured') : chalk.yellow('Not configured'));
  console.log();

  console.log(chalk.blue('Page Configurations:'));
  console.log(chalk.gray('  config/buddypress-pages.js        '), 'BuddyPress pages to test');
  console.log(chalk.gray('  config/woocommerce-pages.js       '), 'WooCommerce pages to test');
  console.log(chalk.gray('  config/learndash-pages.js         '), 'LearnDash pages to test');
  console.log(chalk.gray('  config/custom-pages.js            '), 'Your custom pages');
  console.log();

  console.log(chalk.blue('Device Testing:'));
  console.log(chalk.gray('  File: config/devices.js'));
  console.log(chalk.gray('  Devices: Mobile, Tablet, Desktop, Large Desktop'));
  console.log();

  console.log(chalk.bold.green('🐛 DEBUGGING'));
  console.log(chalk.gray('  DEBUG=true npm run test:buddypress:before'));
  console.log(chalk.gray('    '), '↳ Show browser during testing');
  console.log();
  console.log(chalk.gray('  VERBOSE=true npm run test:buddypress:before'));
  console.log(chalk.gray('    '), '↳ Show detailed output');
  console.log();

  console.log(chalk.bold.green('📈 UNDERSTANDING RESULTS'));
  console.log(chalk.green('  ✅ Green (Passed)        '), 'No significant visual changes (<1%)');
  console.log(chalk.yellow('  🟡 Yellow (Minor)        '), 'Small changes (1-5% difference)');
  console.log(chalk.red('  🔴 Red (Major)           '), 'Significant changes (>5% difference)');
  console.log();

  console.log(chalk.bold.green('🆘 TROUBLESHOOTING'));
  console.log(chalk.blue('Common Issues:'));
  console.log(chalk.gray('  "Site not accessible"    '), '→ Check if local server is running');
  console.log(chalk.gray('  "Login failed"           '), '→ Verify credentials in config/site-settings.js');
  console.log(chalk.gray('  "No screenshots"         '), '→ Check if plugin pages exist');
  console.log(chalk.gray('  "Browser launch failed"  '), '→ Try: npm install puppeteer');
  console.log();

  console.log(chalk.blue('Get Help:'));
  console.log(chalk.gray('  npm run health-check              '), 'Diagnose setup issues');
  console.log(chalk.gray('  Check the README.md file          '), 'Detailed documentation');
  console.log(chalk.gray('  Visit plugin documentation        '), 'BuddyPress, WooCommerce, LearnDash docs');
  console.log();

  console.log(chalk.bold.green('💡 TIPS FOR SUCCESS'));
  console.log(chalk.gray('  • Always run "before" capture first'));
  console.log(chalk.gray('  • Make small, focused changes'));
  console.log(chalk.gray('  • Review reports carefully'));
  console.log(chalk.gray('  • Use "quick" commands for faster iteration'));
  console.log(chalk.gray('  • Clean up regularly to save disk space'));
  console.log();

  console.log(chalk.bold.blue('Happy testing! 🎉\n'));
}

if (require.main === module) {
  showHelp();
}

module.exports = showHelp;