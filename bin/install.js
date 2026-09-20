#!/usr/bin/env node

/**
 * Universal Installer for HT_AI_SKILL
 * Automatically detects active agents (Claude Code, Oh My Pi, Cursor, Codex)
 * and copies or symlinks the skills and rules.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const cwd = process.cwd();
const repoRoot = path.resolve(__dirname, '..');
const isDryRun = process.argv.includes('--dry-run');

console.log('🤖 [HT_AI_SKILL] Universal Installer for AI Coding Agents\n');

const targets = [
  {
    name: 'Claude Code',
    detect: () => fs.existsSync(path.join(cwd, '.claude')) || fs.existsSync(path.join(os.homedir(), '.claude')),
    skillDir: path.join(cwd, '.claude', 'skills'),
    ruleFile: path.join(cwd, 'CLAUDE.md'),
  },
  {
    name: 'Oh My Pi (OMP)',
    detect: () => fs.existsSync(path.join(cwd, '.omp')) || fs.existsSync(path.join(os.homedir(), '.omp')),
    skillDir: path.join(os.homedir(), '.omp', 'skills'),
    ruleFile: path.join(os.homedir(), '.omp', 'rules'),
  },
  {
    name: 'Cursor',
    detect: () => fs.existsSync(path.join(cwd, '.cursor')),
    skillDir: path.join(cwd, '.cursor', 'rules'),
    ruleFile: path.join(cwd, '.cursorrules'),
  },
  {
    name: 'Codex / Universal',
    detect: () => true,
    skillDir: path.join(cwd, '.agent', 'skills'),
    ruleFile: path.join(cwd, 'AGENTS.md'),
  }
];

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

function install() {
  const skillsSource = path.join(repoRoot, 'skills');
  const rulesSource = path.join(repoRoot, 'rules');

  if (!fs.existsSync(skillsSource)) {
    console.error('❌ Could not find skills directory at:', skillsSource);
    process.exit(1);
  }

  let installedCount = 0;

  for (const target of targets) {
    if (target.detect()) {
      console.log(`📦 Found environment: ${target.name}`);

      if (!isDryRun) {
        // Copy skills
        fs.mkdirSync(target.skillDir, { recursive: true });
        copyFolderSync(skillsSource, target.skillDir);
        console.log(`   ✅ Installed skills -> ${target.skillDir}`);

        // Copy / append rule references if needed
        const claudeMdSrc = path.join(repoRoot, 'CLAUDE.md');
        if (target.name === 'Claude Code' && fs.existsSync(claudeMdSrc) && !fs.existsSync(target.ruleFile)) {
          fs.copyFileSync(claudeMdSrc, target.ruleFile);
          console.log(`   ✅ Created ${target.ruleFile}`);
        }
      } else {
        console.log(`   [Dry-run] Would copy skills to: ${target.skillDir}`);
      }

      installedCount++;
      if (target.name === 'Claude Code' || target.name === 'Cursor') break; // Prioritize local project agent
    }
  }

  console.log(`\n✨ Successfully wired HT_AI_SKILL into ${installedCount} agent environment(s)!`);
}

install();
