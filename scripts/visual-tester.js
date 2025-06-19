// scripts/visual-tester.js
// Main visual testing engine

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const cliProgress = require('cli-progress');

const settings = require('../config/site-settings');
const devices = require('../config/devices');

class VisualTester {
  constructor(mode = 'before', pluginConfig = null) {
    this.mode = mode;
    this.pluginConfig = pluginConfig;
    this.browser = null;
    this.page = null;
    this.outputDir = path.join(__dirname, '..', 'screenshots', mode);
    this.results = [];
  }

  async init() {
    console.log(chalk.blue(`🚀 Starting ${this.mode} visual testing...`));
    
    await fs.ensureDir(this.outputDir);
    
    this.browser = await puppeteer.launch({
      ...settings.browser,
      headless: process.env.DEBUG ? false : settings.browser.headless
    });
    
    this.page = await this.browser.newPage();
    
    // Optimize page loading
    await this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      const url = req.url();
      const resourceType = req.resourceType();
      
      // Block external analytics and social media for faster loading
      if (url.includes('google-analytics') || 
          url.includes('facebook.net') ||
          url.includes('twitter.com') ||
          url.includes('googletagmanager') ||
          url.includes('doubleclick.net')) {
        req.abort();
        return;
      }
      
      // Allow essential resources
      if (['document', 'script', 'xhr', 'fetch', 'stylesheet'].includes(resourceType)) {
        req.continue();
      } else if (settings.performance.blockResources.includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await this.page.setDefaultNavigationTimeout(settings.screenshot.timeout);
    console.log(chalk.green('✅ Browser initialized'));
  }

  async authenticate() {
    if (!settings.auth.username) {
      console.log(chalk.yellow('⚠️  No authentication configured, testing public pages only'));
      return false;
    }

    console.log(chalk.blue('🔐 Logging into WordPress...'));
    
    try {
      const loginUrl = `${settings.baseUrl}${settings.auth.loginUrl}`;
      await this.page.goto(loginUrl, { waitUntil: 'networkidle0' });
      
      // Wait for login form
      await this.page.waitForSelector('#user_login', { timeout: 10000 });
      
      // Fill login form
      await this.page.type('#user_login', settings.auth.username);
      await this.page.type('#user_pass', settings.auth.password);
      
      // Submit and wait for navigation
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
        this.page.click('#wp-submit')
      ]);
      
      // Check if login was successful
      const currentUrl = this.page.url();
      if (currentUrl.includes('wp-admin') && !currentUrl.includes('wp-login')) {
        console.log(chalk.green('✅ Authentication successful'));
        return true;
      } else {
        throw new Error('Login appears to have failed');
      }
      
    } catch (error) {
      console.log(chalk.red('❌ Authentication failed:', error.message));
      console.log(chalk.yellow('💡 Check your credentials in config/site-settings.js'));
      return false;
    }
  }

  async capturePageScreenshot(pageConfig, device) {
    const filename = `${pageConfig.name}-${device.name}.png`;
    const filepath = path.join(this.outputDir, filename);

    try {
      // Set device configuration
      await this.page.setViewport(device.viewport);
      await this.page.setUserAgent(device.userAgent);

      // Navigate to page
      const url = `${settings.baseUrl}${pageConfig.path}`;
      await this.page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: settings.screenshot.timeout 
      });

      // Wait for page to stabilize
      await this.page.waitForTimeout(settings.delays.afterPageLoad);

      // Hide dynamic elements that cause false positives
      await this.page.evaluate(() => {
        const dynamicSelectors = [
          // Generic dynamic content
          '.time-since', '.activity-time-since', '[class*="time"]',
          '.loading', '[class*="loading"]', '.spinner',
          '.notification', '[class*="notification"]',
          '[data-livestamp]', '.live-timestamp',
          
          // WordPress admin bar
          '#wpadminbar',
          
          // BuddyPress specific
          '.bb-pusher-typing-indicator',
          
          // WooCommerce specific
          '.woocommerce-message', '.wc-forward',
          '.cart-contents', '.cart-subtotal',
          
          // LearnDash specific
          '.ld-course-timer', '.ld-quiz-timer',
          '.ld-progress-percentage'
        ];
        
        dynamicSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            el.style.visibility = 'hidden';
          });
        });

        // Scroll to load lazy images, then back to top
        window.scrollTo(0, document.body.scrollHeight);
        window.scrollTo(0, 0);
      });

      // Final wait before screenshot
      await this.page.waitForTimeout(settings.delays.beforeScreenshot);

      // Capture screenshot
      await this.page.screenshot({
        path: filepath,
        fullPage: settings.screenshot.fullPage,
        type: settings.screenshot.type,
        quality: settings.screenshot.quality
      });

      return { 
        success: true, 
        filepath, 
        filename, 
        url,
        device: device.name,
        page: pageConfig.name,
        category: pageConfig.category || 'general'
      };

    } catch (error) {
      console.log(chalk.red(`❌ Failed ${pageConfig.name} on ${device.name}:`, error.message));
      return { 
        success: false, 
        error: error.message, 
        filename, 
        url: `${settings.baseUrl}${pageConfig.path}`,
        device: device.name,
        page: pageConfig.name
      };
    }
  }

  getAllPages() {
    if (!this.pluginConfig) {
      return [{ name: 'homepage', path: '/', description: 'Homepage', category: 'general' }];
    }

    // Flatten all page categories
    const allPages = [];
    Object.keys(this.pluginConfig).forEach(category => {
      this.pluginConfig[category].forEach(page => {
        allPages.push({
          ...page,
          category: category
        });
      });
    });

    return allPages;
  }

  async runTests() {
    const pages = this.getAllPages();
    const totalTests = pages.length * devices.length;
    
    console.log(chalk.blue(`📸 Testing ${pages.length} pages across ${devices.length} devices (${totalTests} total screenshots)`));

    const progressBar = new cliProgress.SingleBar({
      format: 'Progress |{bar}| {percentage}% | {value}/{total} | {current}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591'
    });
    progressBar.start(totalTests, 0);

    for (const pageConfig of pages) {
      for (const device of devices) {
        const result = await this.capturePageScreenshot(pageConfig, device);
        this.results.push(result);
        
        progressBar.increment({ 
          current: `${pageConfig.name}-${device.name}` 
        });
        
        // Small delay between captures for stability
        await this.page.waitForTimeout(settings.delays.betweenPages);
      }
    }

    progressBar.stop();
    return this.results;
  }

  async generateSummary() {
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;

    console.log('\n' + chalk.green('📊 Test Summary:'));
    console.log(chalk.green(`✅ Successful: ${successful}/${total}`));
    
    if (failed > 0) {
      console.log(chalk.red(`❌ Failed: ${failed}/${total}`));
      
      // Group failures by category for better reporting
      const failuresByCategory = {};
      this.results.filter(r => !r.success).forEach(result => {
        const category = result.category || 'general';
        if (!failuresByCategory[category]) failuresByCategory[category] = [];
        failuresByCategory[category].push(result);
      });

      console.log('\n' + chalk.red('Failed Tests by Category:'));
      Object.keys(failuresByCategory).forEach(category => {
        console.log(chalk.red(`\n${category.toUpperCase()}:`));
        failuresByCategory[category].forEach(failure => {
          console.log(chalk.red(`  • ${failure.page} (${failure.device})`));
          console.log(chalk.gray(`    URL: ${failure.url}`));
          console.log(chalk.gray(`    Error: ${failure.error}`));
        });
      });
    }

    // Save detailed results
    const resultsPath = path.join(__dirname, '..', 'reports', `${this.mode}-results.json`);
    await fs.ensureDir(path.dirname(resultsPath));
    await fs.writeJson(resultsPath, {
      mode: this.mode,
      timestamp: new Date().toISOString(),
      site: settings.baseUrl,
      summary: { total, successful, failed },
      results: this.results
    }, { spaces: 2 });

    console.log(chalk.blue(`📄 Detailed results saved: ${resultsPath}`));
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log(chalk.blue('🧹 Cleanup complete'));
    }
  }

  async run() {
    try {
      await this.init();
      await this.authenticate();
      await this.runTests();
      await this.generateSummary();
      return this.results;
    } catch (error) {
      console.log(chalk.red('💥 Testing failed:', error.message));
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

module.exports = VisualTester;