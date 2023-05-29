import WebTorrent from 'webtorrent-hybrid';
import { SingleBar, Presets } from 'cli-progress';
import { EventEmitter } from 'events';
import readline from 'readline';

const client = new WebTorrent();
const progressBars = [];

const downloadTorrents = (magnetURIs) => {
  let completedCount = 0; // Counter for completed downloads

  magnetURIs.forEach((magnetURI, index) => {
    const progress = new SingleBar({
      format: `Torrent ${index + 1} |{bar}| {percentage}% | ETA: {eta}s | {value}/{total} MB | Speed: {speed}`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    }, Presets.shades_classic);

    progressBars.push(progress);

    client.add(magnetURI, { path: './downloads' }, (torrent) => {
      console.log(`Downloading: ${torrent.name}`);
      const totalSize = torrent.length / 1000000;
      let lastDownloaded = 0;
      let lastTime = Date.now();

      // Increase the maximum number of listeners for the 'torrent' object
      EventEmitter.defaultMaxListeners = 15;

      const updateSpeed = () => {
        const downloaded = torrent.downloaded / 1000000;
        const currentTime = Date.now();
        const timeElapsed = (currentTime - lastTime) / 1000; // Time elapsed in seconds
        const speed = getReadableSpeed((downloaded - lastDownloaded) / timeElapsed);
        lastDownloaded = downloaded;
        lastTime = currentTime;
        progress.update(downloaded, { speed });
      };

      torrent.on('download', (bytes) => {
        updateSpeed();
      });

      torrent.on('done', () => {
        progress.update(totalSize, { speed: 'N/A' });
        progress.stop();
        console.log(`Torrent ${index + 1} download finished: ${torrent.name}`);
        completedCount++;

        if (completedCount === magnetURIs.length) {
          // All downloads finished, exit the command line
          console.log('All downloads completed. Exiting...');
          process.exit(0);
        }
      });

      torrent.on('error', (err) => {
        console.log(`Error downloading torrent ${index + 1}: ${torrent.name}`, err);
        completedCount++;

        if (completedCount === magnetURIs.length) {
          // All downloads finished, exit the command line
          console.log('All downloads completed. Exiting...');
          process.exit(0);
        }
      });

      progress.start(totalSize, 0, { speed: 'N/A' });
    });
  });
};

const getReadableSpeed = (speed) => {
  if (speed < 1024) {
    return `${speed.toFixed(2)} B/s`;
  } else if (speed < 1024 * 1024) {
    return `${(speed / 1024).toFixed(2)} KB/s`;
  } else {
    return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;
  }
};

// Read input from the user on the second line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter magnet URIs (separated by space): ', (input) => {
  const magnetURIs = input.split(' ').filter(Boolean);
  if (magnetURIs.length === 0) {
    console.error('Please provide at least one magnet URI.');
    process.exit(1);
  }
  downloadTorrents(magnetURIs);
  rl.close();
});
