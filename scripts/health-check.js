// scripts/health-check.js
// Check if the site is accessible and ready for testing

const fetch = require('node-fetch');
const chalk = require('chalk');
const settings = require('../config/site-settings');

class HealthCheck {
  async checkSiteAccessibility() {
    console.log(chalk.blue('🏥 Checking site accessibility...'));
    
    try {
      const response = await fetch(settings.baseUrl, {
        method: 'HEAD',
        timeout: 10000
      });

      if (response.ok) {
        console.log(chalk.green(`✅ Site is accessible: ${settings.baseUrl}`));
        return true;
      } else {
        console.log(chalk.red(`❌ Site returned ${response.status}: ${response.statusText}`));
        return false;
      }
    } catch (error) {
      console.log(chalk.red(`❌ Site is not accessible: ${error.message}`));
      console.log(chalk.yellow('💡 Make sure your local development server is running'));
      return false;
    }
  }

  async checkWordPressLogin() {
    if (!settings.auth.username) {
      console.log(chalk.yellow('⚠️  No login credentials configured'));
      return true;
    }

    console.log(chalk.blue('🔐 Checking WordPress login...'));
    
    try {
      const loginUrl = `${settings.baseUrl}${settings.auth.loginUrl}`;
      const response = await fetch(loginUrl, {
        method: 'HEAD',
        timeout: 10000
      });

      if (response.ok) {
        console.log(chalk.green('✅ WordPress login page is accessible'));
        return true;
      } else {
        console.log(chalk.yellow('⚠️  WordPress login page may not be accessible'));
        return false;
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not verify WordPress login page'));
      return false;
    }
  }

  async checkDependencies() {
    console.log(chalk.blue('📦 Checking dependencies...'));
    
    try {
      require('puppeteer');
      console.log(chalk.green('✅ Puppeteer installed'));
    } catch (error) {
      console.log(chalk.red('❌ Puppeteer not installed'));
      console.log(chalk.gray('   Run: npm install puppeteer'));
      return false;
    }

    try {
      require('pixelmatch');
      console.log(chalk.green('✅ Pixelmatch installed'));
    } catch (error) {
      console.log(chalk.red('❌ Pixelmatch not installed'));
      console.log(chalk.gray('   Run: npm install pixelmatch'));
      return false;
    }

    return true;
  }

  async checkFolders() {
    console.log(chalk.blue('📁 Checking folder structure...'));
    
    const fs = require('fs-extra');
    const path = require('path');

    const requiredFolders = [
      'screenshots',
      'screenshots/before',
      'screenshots/after', 
      'screenshots/diff',
      'reports',
      'config'
    ];

    let allGood = true;

    for (const folder of requiredFolders) {
      const folderPath = path.join(__dirname, '..', folder);
      if (await fs.pathExists(folderPath)) {
        console.log(chalk.green(`✅ ${folder}/ exists`));
      } else {
        console.log(chalk.yellow(`⚠️  ${folder}/ missing (will be created)`));
        await fs.ensureDir(folderPath);
        console.log(chalk.green(`✅ Created ${folder}/`));
      }
    }

    return allGood;
  }

  async run() {
    console.log(chalk.bold.blue('\n🔍 WordPress Visual Testing Health Check\n'));
    
    const checks = [
      { name: 'Dependencies', check: () => this.checkDependencies() },
      { name: 'Folder Structure', check: () => this.checkFolders() },
      { name: 'Site Accessibility', check: () => this.checkSiteAccessibility() },
      { name: 'WordPress Login', check: () => this.checkWordPressLogin() }
    ];

    let allPassed = true;
    
    for (const { name, check } of checks) {
      const passed = await check();
      if (!passed) allPassed = false;
      console.log(); // Add spacing
    }

    if (allPassed) {
      console.log(chalk.bold.green('🎉 All checks passed! Ready for visual testing'));
      console.log(chalk.blue('\nNext steps:'));
      console.log(chalk.gray('1. Run: npm run test:buddypress:before'));
      console.log(chalk.gray('2. Make your CSS changes'));
      console.log(chalk.gray('3. Run: npm run test:buddypress:after'));
      console.log(chalk.gray('4. Run: npm run compare'));
      console.log(chalk.gray('5. Run: npm run report'));
    } else {
      console.log(chalk.bold.yellow('⚠️  Some issues detected. Please fix them before testing.'));
      console.log(chalk.blue('\nCommon fixes:'));
      console.log(chalk.gray('• Check that your local server is running'));
      console.log(chalk.gray('• Verify site URL in config/site-settings.js'));
      console.log(chalk.gray('• Run: npm install'));
    }

    return allPassed;
  }
}

if (require.main === module) {
  const healthCheck = new HealthCheck();
  healthCheck.run().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}

module.exports = HealthCheck;