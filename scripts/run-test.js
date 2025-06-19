// scripts/run-test.js
// CLI script to run tests with different plugin configurations

const VisualTester = require('./visual-tester');
const chalk = require('chalk');

// Import all plugin configurations
const pluginConfigs = {
  buddypress: require('../config/buddypress-pages'),
  woocommerce: require('../config/woocommerce-pages'),
  learndash: require('../config/learndash-pages'),
  custom: require('../config/custom-pages')
};

async function runTest() {
  const pluginType = process.argv[2];
  const mode = process.argv[3] || 'before';

  // Validate arguments
  if (!pluginType || !Object.keys(pluginConfigs).includes(pluginType)) {
    console.log(chalk.red('❌ Invalid plugin type'));
    console.log(chalk.yellow('Available options: buddypress, woocommerce, learndash, custom'));
    console.log(chalk.gray('Usage: node scripts/run-test.js <plugin> <mode>'));
    console.log(chalk.gray('Example: node scripts/run-test.js buddypress before'));
    process.exit(1);
  }

  if (!['before', 'after'].includes(mode)) {
    console.log(chalk.red('❌ Invalid mode. Use "before" or "after"'));
    process.exit(1);
  }

  // Get plugin configuration
  const pluginConfig = pluginConfigs[pluginType];
  
  console.log(chalk.blue(`🎯 Testing ${pluginType.toUpperCase()} pages in ${mode} mode`));
  
  try {
    const tester = new VisualTester(mode, pluginConfig);
    await tester.run();
    
    console.log(chalk.green('\n🎉 Testing completed successfully!'));
    console.log(chalk.blue('Next steps:'));
    
    if (mode === 'before') {
      console.log(chalk.gray('1. Make your CSS/theme changes'));
      console.log(chalk.gray(`2. Run: npm run test:${pluginType}:after`));
      console.log(chalk.gray('3. Run: npm run compare'));
      console.log(chalk.gray('4. Run: npm run report'));
    } else {
      console.log(chalk.gray('1. Run: npm run compare'));
      console.log(chalk.gray('2. Run: npm run report'));
    }
    
  } catch (error) {
    console.error(chalk.red('💥 Error:', error.message));
    process.exit(1);
  }
}

runTest();