#!/usr/bin/env node
/**
 * SCRIPT THÊM EPISODE MỚI VÀO DATABASE (v2 — CLI args)
 * =====================================================
 * Usage:
 *   node update_db.js --file <name.mp3> --title <title> --desc <html_desc> [--duration auto|HH:MM:SS] [--dry-run]
 *
 * Examples:
 *   # Add episode, auto-detect duration via ffprobe (default)
 *   node update_db.js --file SIP_35_New.mp3 --title "SIP 35 - Demo" --desc "<p>Hello</p>"
 *
 *   # Specify duration manually
 *   node update_db.js --file SIP_35_New.mp3 --title "SIP 35" --desc "<p>...</p>" --duration 00:18:42
 *
 *   # Dry run — print JSON, do not write files
 *   node update_db.js --file SIP_35_New.mp3 --title "SIP 35" --desc "<p>...</p>" --dry-run
 *
 * Reads from JSON file (alternative to CLI args):
 *   node update_db.js --from-draft ./draft.json
 *   draft.json shape: { file, title, desc, duration? }
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2).replace(/-/g, '_');
      args[key] = argv[++i];
    }
  }
  return args;
}

function probeDuration(filePath) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
    { encoding: 'utf8' }
  ).trim();
  const totalSec = Math.round(parseFloat(out));
  const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function validateTitle(title) {
  if (!title || title.length === 0) throw new Error('Title is empty');
  if (title.length > 100) {
    console.warn(`⚠️  Title dài ${title.length} ký tự — Apple Podcasts cắt ở ~100. Cân nhắc rút gọn.`);
  }
}

function validateDesc(desc) {
  if (!desc || desc.length === 0) throw new Error('Description is empty');
  if (/<script[\s>]/i.test(desc)) throw new Error('Description chứa <script> tag — bị block bởi Spotify/Apple');
  if (desc.length > 4000) {
    console.warn(`⚠️  Description dài ${desc.length} ký tự — Apple Podcasts limit 4000.`);
  }
}

function main() {
  const args = parseArgs(process.argv);

  let { file, title, desc, duration } = args;
  if (args.from_draft) {
    const draft = JSON.parse(fs.readFileSync(args.from_draft, 'utf8'));
    file = file || draft.file;
    title = title || draft.title;
    desc = desc || draft.desc;
    duration = duration || draft.duration;
  }

  if (!file || !title || !desc) {
    console.error('❌ Missing required args: --file, --title, --desc (or --from-draft <path>)');
    console.error('Run with no args to see usage.');
    process.exit(1);
  }

  validateTitle(title);
  validateDesc(desc);

  const audioPath = path.join('episodes', file);
  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file không tồn tại: ${audioPath}`);
  }

  const config = require('./podcast_config.json');
  let episodes = [];
  try { episodes = require('./episodes.json'); } catch (_) {}

  const stats = fs.statSync(audioPath);
  const dur = (!duration || duration === 'auto') ? probeDuration(audioPath) : duration;

  const ep = {
    id: crypto.randomUUID(),
    title,
    description: desc,
    audioFile: file,
    duration: dur,
    fileSize: stats.size,
    publishDate: new Date().toISOString(),
    episodeNumber: config.nextEpisodeNumber,
  };

  if (args.dryRun) {
    console.log('🧪 DRY RUN — episode object (KHÔNG ghi file):');
    console.log(JSON.stringify(ep, null, 2));
    console.log(`\nWould bump nextEpisodeNumber: ${config.nextEpisodeNumber} → ${config.nextEpisodeNumber + 1}`);
    return;
  }

  episodes.unshift(ep);
  config.nextEpisodeNumber++;

  fs.writeFileSync('./episodes.json', JSON.stringify(episodes, null, 2));
  fs.writeFileSync('./podcast_config.json', JSON.stringify(config, null, 2));

  console.log(`✅ Episode added: SIP ${ep.episodeNumber} — ${ep.title}`);
  console.log(`   Duration: ${ep.duration} | Size: ${(ep.fileSize / 1024 / 1024).toFixed(1)} MB`);
}

main();
