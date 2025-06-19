// scripts/compare.js
// Advanced visual comparison engine

const fs = require('fs-extra');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const chalk = require('chalk');
const cliProgress = require('cli-progress');

const settings = require('../config/site-settings');

class AdvancedComparison {
  constructor() {
    this.beforeDir = path.join(__dirname, '..', 'screenshots', 'before');
    this.afterDir = path.join(__dirname, '..', 'screenshots', 'after');
    this.diffDir = path.join(__dirname, '..', 'screenshots', 'diff');
    this.reportsDir = path.join(__dirname, '..', 'reports');
  }

  async init() {
    await fs.ensureDir(this.diffDir);
    await fs.ensureDir(this.reportsDir);
  }

  async compareImages(beforePath, afterPath, diffPath) {
    try {
      const beforeImg = PNG.sync.read(fs.readFileSync(beforePath));
      const afterImg = PNG.sync.read(fs.readFileSync(afterPath));

      const { width, height } = beforeImg;
      const diff = new PNG({ width, height });

      const pixelDiff = pixelmatch(
        beforeImg.data,
        afterImg.data,
        diff.data,
        width,
        height,
        {
          threshold: settings.comparison.threshold,
          includeAA: false,
          alpha: 0.1,
          aaColor: [255, 255, 0],
          diffColor: settings.comparison.diffColor
        }
      );

      fs.writeFileSync(diffPath, PNG.sync.write(diff));

      const totalPixels = width * height;
      const diffPercentage = (pixelDiff / totalPixels) * 100;

      // Determine severity
      let severity = 'none';
      if (diffPercentage > 10) severity = 'critical';
      else if (diffPercentage > 5) severity = 'major';
      else if (diffPercentage > 1) severity = 'minor';
      else if (diffPercentage > 0.1) severity = 'minimal';

      return {
        success: true,
        pixelDiff,
        totalPixels,
        diffPercentage,
        severity,
        passed: diffPercentage < 1,
        dimensions: { width, height }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  parseFilename(filename) {
    // Extract page and device from filename: "page-name-Device-Name.png"
    const parts = filename.replace('.png', '').split('-');
    const device = parts.pop();
    const page = parts.join('-');
    
    return { page, device };
  }

  async compareAllScreenshots() {
    const beforeFiles = await fs.readdir(this.beforeDir).catch(() => []);
    const afterFiles = await fs.readdir(this.afterDir).catch(() => []);

    const matchingFiles = beforeFiles.filter(file => 
      afterFiles.includes(file) && file.endsWith('.png')
    );

    if (matchingFiles.length === 0) {
      console.log(chalk.red('❌ No matching screenshot pairs found!'));
      console.log(chalk.yellow('Make sure you have run both "before" and "after" captures.'));
      console.log(chalk.gray('Before files:', beforeFiles.length));
      console.log(chalk.gray('After files:', afterFiles.length));
      return { results: [], stats: {} };
    }

    console.log(chalk.blue(`🔍 Comparing ${matchingFiles.length} screenshot pairs...`));

    const progressBar = new cliProgress.SingleBar({
      format: 'Comparing |{bar}| {percentage}% | {value}/{total} | {current}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591'
    });
    progressBar.start(matchingFiles.length, 0);

    const results = [];
    const stats = {
      total: 0,
      passed: 0,
      failed: 0,
      byDevice: {},
      bySeverity: { none: 0, minimal: 0, minor: 0, major: 0, critical: 0 }
    };

    for (const filename of matchingFiles) {
      const beforePath = path.join(this.beforeDir, filename);
      const afterPath = path.join(this.afterDir, filename);
      const diffPath = path.join(this.diffDir, `diff-${filename}`);

      const comparison = await this.compareImages(beforePath, afterPath, diffPath);
      const { page, device } = this.parseFilename(filename);

      const result = {
        filename,
        page,
        device,
        beforePath,
        afterPath,
        diffPath,
        ...comparison
      };

      results.push(result);

      // Update statistics
      stats.total++;
      if (comparison.success && comparison.passed) {
        stats.passed++;
      } else {
        stats.failed++;
      }

      if (comparison.severity) {
        stats.bySeverity[comparison.severity]++;
      }

      if (!stats.byDevice[device]) stats.byDevice[device] = { passed: 0, failed: 0 };
      stats.byDevice[device][comparison.passed ? 'passed' : 'failed']++;

      progressBar.increment({ current: filename });
    }

    progressBar.stop();
    return { results, stats };
  }

  generateAdvancedReport(results, stats) {
    const timestamp = new Date().toISOString();
    const reportTitle = `Visual Testing Report - ${new Date().toLocaleDateString()}`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${reportTitle}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: #f8f9fa;
            line-height: 1.6;
        }
        
        .header { 
            background: white; 
            padding: 40px; 
            border-radius: 12px; 
            margin-bottom: 30px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .header h1 { 
            margin: 0 0 10px 0; 
            color: #1a1a1a; 
            font-size: 2.5em;
        }
        
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px; 
            margin-bottom: 40px; 
        }
        
        .stat-card { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .stat-card.total { border-top: 4px solid #007bff; }
        .stat-card.passed { border-top: 4px solid #28a745; }
        .stat-card.failed { border-top: 4px solid #dc3545; }
        .stat-card.warning { border-top: 4px solid #ffc107; }
        
        .stat-number { 
            font-size: 3em; 
            font-weight: bold; 
            margin: 10px 0;
        }
        
        .stat-number.success { color: #28a745; }
        .stat-number.danger { color: #dc3545; }
        .stat-number.primary { color: #007bff; }
        .stat-number.warning { color: #ffc107; }
        
        .filter-buttons { 
            background: white; 
            padding: 20px; 
            border-radius: 12px; 
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .filter-btn { 
            padding: 10px 20px; 
            margin: 5px; 
            border: 2px solid #dee2e6; 
            background: white; 
            border-radius: 6px; 
            cursor: pointer; 
            transition: all 0.2s;
        }
        
        .filter-btn:hover { background: #f8f9fa; }
        .filter-btn.active { background: #007bff; color: white; border-color: #007bff; }
        
        .comparison-grid { 
            display: grid; 
            gap: 30px; 
        }
        
        .comparison-item { 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .comparison-item.passed { border-left: 6px solid #28a745; }
        .comparison-item.failed { border-left: 6px solid #dc3545; }
        
        .comparison-header { 
            padding: 20px; 
            border-bottom: 1px solid #dee2e6;
        }
        
        .comparison-title { 
            font-size: 1.3em; 
            font-weight: bold; 
            margin: 0 0 10px 0;
            color: #1a1a1a;
        }
        
        .severity-badge { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 0.8em; 
            font-weight: bold; 
            text-transform: uppercase;
            margin-left: 10px;
        }
        
        .severity-none { background: #d4edda; color: #155724; }
        .severity-minimal { background: #fff3cd; color: #856404; }
        .severity-minor { background: #ffeaa7; color: #856404; }
        .severity-major { background: #f8d7da; color: #721c24; }
        .severity-critical { background: #721c24; color: white; }
        
        .images-container { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            padding: 20px;
        }
        
        .image-section { 
            text-align: center;
        }
        
        .image-section h4 { 
            margin: 0 0 15px 0; 
            color: #495057;
            font-size: 1.1em;
        }
        
        .image-section img { 
            max-width: 100%; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            cursor: pointer;
        }
        
        .hidden { display: none !important; }
        
        @media (max-width: 768px) {
            .images-container { 
                grid-template-columns: 1fr; 
            }
            
            .stat-number { 
                font-size: 2em; 
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📸 Visual Testing Report</h1>
        <div>Generated on ${new Date().toLocaleString()}</div>
        <div>Site: ${settings.baseUrl}</div>
    </div>

    <div class="stats-grid">
        <div class="stat-card total">
            <h3>Total Tests</h3>
            <div class="stat-number primary">${stats.total}</div>
        </div>
        <div class="stat-card passed">
            <h3>Passed</h3>
            <div class="stat-number success">${stats.passed}</div>
        </div>
        <div class="stat-card failed">
            <h3>Changes Found</h3>
            <div class="stat-number danger">${stats.failed}</div>
        </div>
        <div class="stat-card warning">
            <h3>Success Rate</h3>
            <div class="stat-number warning">${((stats.passed / stats.total) * 100).toFixed(1)}%</div>
        </div>
    </div>

    <div class="filter-buttons">
        <h3>🔍 Filter Results</h3>
        <button class="filter-btn active" onclick="filterResults('all')">All Results</button>
        <button class="filter-btn" onclick="filterResults('passed')">Passed Only</button>
        <button class="filter-btn" onclick="filterResults('failed')">Changes Only</button>
        <button class="filter-btn" onclick="filterResults('critical')">Critical Changes</button>
    </div>

    <div class="comparison-grid" id="results-container">
        ${results.map(result => `
            <div class="comparison-item ${result.passed ? 'passed' : 'failed'}" 
                 data-status="${result.passed ? 'passed' : 'failed'}" 
                 data-severity="${result.severity || 'none'}">
                <div class="comparison-header">
                    <div class="comparison-title">
                        ${result.page} - ${result.device}
                        ${result.severity ? `<span class="severity-badge severity-${result.severity}">${result.severity}</span>` : ''}
                    </div>
                    <div class="comparison-meta">
                        ${result.success ? `
                            ${result.passed ? 
                                `✅ No significant changes detected` : 
                                `❌ ${result.diffPercentage?.toFixed(2)}% difference (${result.pixelDiff} pixels)`
                            }
                        ` : `❌ Error: ${result.error}`}
                    </div>
                </div>
                ${result.success ? `
                    <div class="images-container">
                        <div class="image-section">
                            <h4>Before</h4>
                            <img src="../screenshots/before/${result.filename}" alt="Before" loading="lazy">
                        </div>
                        <div class="image-section">
                            <h4>After</h4>
                            <img src="../screenshots/after/${result.filename}" alt="After" loading="lazy">
                        </div>
                        <div class="image-section">
                            <h4>Differences</h4>
                            <img src="../screenshots/diff/diff-${result.filename}" alt="Differences" loading="lazy">
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <script>
        function filterResults(filter) {
            const items = document.querySelectorAll('.comparison-item');
            const buttons = document.querySelectorAll('.filter-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            items.forEach(item => {
                const status = item.dataset.status;
                const severity = item.dataset.severity;
                
                let show = false;
                switch(filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'passed':
                        show = status === 'passed';
                        break;
                    case 'failed':
                        show = status === 'failed';
                        break;
                    case 'critical':
                        show = severity === 'critical' || severity === 'major';
                        break;
                }
                
                item.classList.toggle('hidden', !show);
            });
        }
        
        document.querySelectorAll('.image-section img').forEach(img => {
            img.addEventListener('click', () => {
                window.open(img.src, '_blank');
            });
        });
    </script>
</body>
</html>`;

    return html;
  }

  async run() {
    try {
      await this.init();
      
      const { results, stats } = await this.compareAllScreenshots();
      
      if (results.length === 0) {
        console.log(chalk.yellow('⚠️  No comparisons to generate report'));
        return null;
      }

      // Generate HTML report
      const reportHtml = this.generateAdvancedReport(results, stats);
      const reportPath = path.join(this.reportsDir, 'visual-comparison-report.html');
      await fs.writeFile(reportPath, reportHtml);
      
      // Save JSON results
      const jsonPath = path.join(this.reportsDir, 'comparison-results.json');
      await fs.writeJson(jsonPath, { results, stats, timestamp: new Date().toISOString() }, { spaces: 2 });
      
      // Print summary
      console.log('\n' + chalk.green('📊 Comparison Complete!'));
      console.log(chalk.green(`✅ Passed: ${stats.passed}/${stats.total}`));
      if (stats.failed > 0) {
        console.log(chalk.red(`❌ Changes detected: ${stats.failed}/${stats.total}`));
        
        if (stats.bySeverity.critical > 0) {
          console.log(chalk.red(`🚨 Critical changes: ${stats.bySeverity.critical}`));
        }
        if (stats.bySeverity.major > 0) {
          console.log(chalk.yellow(`⚠️  Major changes: ${stats.bySeverity.major}`));
        }
      }
      
      console.log(chalk.blue(`📄 Report saved: ${reportPath}`));
      console.log(chalk.gray(`💡 Run 'npm run report' to open the visual report`));
      
      return { results, stats };
    } catch (error) {
      console.log(chalk.red('💥 Comparison failed:', error.message));
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  const comparison = new AdvancedComparison();
  comparison.run().catch(error => {
    console.error(chalk.red('💥 Error:', error.message));
    process.exit(1);
  });
}

module.exports = AdvancedComparison;