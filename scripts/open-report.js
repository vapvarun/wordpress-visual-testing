// scripts/open-report.js
// Open the visual comparison report

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');

async function openReport() {
  const reportPath = path.join(__dirname, '..', 'reports', 'visual-comparison-report.html');
  
  if (!await fs.pathExists(reportPath)) {
    console.log(chalk.red('❌ No report found!'));
    console.log(chalk.yellow('Generate a report first by running:'));
    console.log(chalk.gray('1. npm run test:buddypress:before'));
    console.log(chalk.gray('2. npm run test:buddypress:after'));
    console.log(chalk.gray('3. npm run compare'));
    return;
  }

  console.log(chalk.blue('📄 Opening visual comparison report...'));
  
  // Determine the appropriate command based on the platform
  let openCommand;
  switch (process.platform) {
    case 'darwin': // macOS
      openCommand = 'open';
      break;
    case 'win32': // Windows
      openCommand = 'start';
      break;
    default: // Linux and others
      openCommand = 'xdg-open';
      break;
  }

  exec(`${openCommand} "${reportPath}"`, (error) => {
    if (error) {
      console.log(chalk.yellow('⚠️  Could not auto-open report'));
      console.log(chalk.blue(`📄 Report location: ${reportPath}`));
      console.log(chalk.gray('You can open it manually in your browser'));
    } else {
      console.log(chalk.green('✅ Report opened in your default browser'));
    }
  });
}

if (require.main === module) {
  openReport();
}

module.exports = openReport;