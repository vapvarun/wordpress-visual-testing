// scripts/cleanup.js
// Clean up screenshots and reports

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class Cleanup {
  constructor() {
    this.screenshotsDir = path.join(__dirname, '..', 'screenshots');
    this.reportsDir = path.join(__dirname, '..', 'reports');
  }

  async cleanScreenshots(subfolder = null) {
    if (subfolder) {
      const targetDir = path.join(this.screenshotsDir, subfolder);
      if (await fs.pathExists(targetDir)) {
        await fs.emptyDir(targetDir);
        console.log(chalk.green(`✅ Cleaned screenshots/${subfolder}/`));
      }
    } else {
      const subfolders = ['before', 'after', 'diff'];
      for (const folder of subfolders) {
        const targetDir = path.join(this.screenshotsDir, folder);
        if (await fs.pathExists(targetDir)) {
          await fs.emptyDir(targetDir);
          console.log(chalk.green(`✅ Cleaned screenshots/${folder}/`));
        }
      }
    }
  }

  async cleanReports() {
    if (await fs.pathExists(this.reportsDir)) {
      const files = await fs.readdir(this.reportsDir);
      const reportFiles = files.filter(file => 
        file.endsWith('.html') || file.endsWith('.json')
      );
      
      for (const file of reportFiles) {
        await fs.remove(path.join(this.reportsDir, file));
      }
      
      if (reportFiles.length > 0) {
        console.log(chalk.green(`✅ Cleaned ${reportFiles.length} report files`));
      }
    }
  }

  async getStorageInfo() {
    const getFolderSize = async (folderPath) => {
      if (!await fs.pathExists(folderPath)) return 0;
      
      const files = await fs.readdir(folderPath);
      let size = 0;
      
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await fs.stat(filePath);
        size += stats.size;
      }
      
      return size;
    };

    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const folders = ['before', 'after', 'diff'];
    console.log(chalk.blue('\n💾 Storage Information:'));
    
    let totalSize = 0;
    for (const folder of folders) {
      const folderPath = path.join(this.screenshotsDir, folder);
      const size = await getFolderSize(folderPath);
      const files = await fs.readdir(folderPath).catch(() => []);
      
      totalSize += size;
      console.log(chalk.cyan(`  screenshots/${folder}/: ${files.length} files, ${formatBytes(size)}`));
    }
    
    const reportsSize = await getFolderSize(this.reportsDir);
    const reportFiles = await fs.readdir(this.reportsDir).catch(() => []);
    
    totalSize += reportsSize;
    console.log(chalk.cyan(`  reports/: ${reportFiles.length} files, ${formatBytes(reportsSize)}`));
    console.log(chalk.bold.cyan(`  Total: ${formatBytes(totalSize)}`));
  }

  async run() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'all';

    console.log(chalk.blue('🧹 Cleaning up visual testing files...'));

    switch (mode) {
      case 'before':
        await this.cleanScreenshots('before');
        break;
      case 'after':
        await this.cleanScreenshots('after');
        break;
      case 'diff':
        await this.cleanScreenshots('diff');
        break;
      case 'reports':
        await this.cleanReports();
        break;
      case 'screenshots':
        await this.cleanScreenshots();
        break;
      case 'all':
      default:
        await this.cleanScreenshots();
        await this.cleanReports();
        break;
    }

    await this.getStorageInfo();
    
    console.log(chalk.green('\n🎉 Cleanup complete!'));
    
    if (mode === 'all') {
      console.log(chalk.blue('\nYou can now start fresh with:'));
      console.log(chalk.gray('npm run test:buddypress:before'));
    }
  }
}

if (require.main === module) {
  const cleanup = new Cleanup();
  cleanup.run().catch(error => {
    console.error(chalk.red('💥 Error:', error.message));
    process.exit(1);
  });
}

module.exports = Cleanup;