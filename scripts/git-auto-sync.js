import chokidar from 'chokidar';
import { simpleGit } from 'simple-git';

const git = simpleGit({ baseDir: process.cwd() });
const debounceMs = Number(process.env.GIT_SYNC_DEBOUNCE_MS || 5000);
const messagePrefix = process.env.GIT_SYNC_MESSAGE_PREFIX || 'auto-sync';
const branch = process.env.GIT_SYNC_BRANCH || 'main';

let timer = null;
let pendingEvents = 0;

async function hasChanges() {
  const status = await git.status();
  const changed =
    status.not_added.length > 0 ||
    status.modified.length > 0 ||
    status.deleted.length > 0 ||
    status.renamed.length > 0 ||
    status.staged.length > 0;
  return changed;
}

async function syncOnce() {
  try {
    await git.fetch();
    const st1 = await git.status();
    if (st1.behind > 0) {
      await git.pull(['--rebase']);
    }
    if (!(await hasChanges())) {
      return;
    }

    // Add all changes (respect .gitignore)
    await git.add(['.']);

    const timestamp = new Date().toISOString();
    const msg = `${messagePrefix}: ${timestamp}`;
    await git.commit(msg);

    // Push to origin on current / specified branch
    const st2 = await git.status();
    const currentBranch = st2.current || branch;
    await git.push('origin', currentBranch);

    console.log(`[git-auto-sync] Pushed commit: ${msg}`);
  } catch (err) {
    console.error('[git-auto-sync] Error during sync:', err && err.message);
  }
}

function scheduleSync() {
  pendingEvents++;
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    const count = pendingEvents;
    pendingEvents = 0;
    console.log(`[git-auto-sync] Changes detected (${count}). Syncing...`);
    await syncOnce();
  }, debounceMs);
}

// Watch the repo, ignore common folders
const watcher = chokidar.watch('.', {
  ignored: [
    /(^|\\\\|\/)\.git(\\\\|$)/,
    /(^|\\\\|\/)node_modules(\\\\|$)/,
    /(^|\\\\|\/)dist(\\\\|$)/,
  ],
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', (event, _path) => {
  // Only react to file changes, additions, deletions, renames
  if (['add', 'change', 'unlink', 'addDir', 'unlinkDir'].includes(event)) {
    scheduleSync();
  }
});

console.log('[git-auto-sync] Watching for changes...');
