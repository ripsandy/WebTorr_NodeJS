import WebTorrent from 'webtorrent-hybrid';
import { SingleBar, Presets } from 'cli-progress';

const client = new WebTorrent();
const magnetURIs = [];

if (magnetURIs.length === 0) {
  console.error('Please provide at least one magnet URI.');
  process.exit(1);
}

const progressBars = [];

const downloadTorrents = () => {
  magnetURIs.forEach((magnetURI, index) => {
    const progress = new SingleBar({
      format: `Torrent ${index + 1} |{bar}| {percentage}% | {value}/{total} MB `,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    }, Presets.rect);

    progressBars.push(progress);

    client.add(magnetURI, { path: './downloads' }, (torrent) => {
      console.log(`Downloading: ${torrent.name}`);
      const totalSize = torrent.length / 1000000;
      let lastDownloaded = 0;

      const updateSpeed = () => {
        const downloaded = torrent.downloaded / 1000000;
        const speed = getReadableSpeed(downloaded - lastDownloaded);
        lastDownloaded = downloaded;
        progress.update(downloaded, { speed });
      };

      torrent.on('download', (bytes) => {
        updateSpeed();
      });

      torrent.on('done', () => {
        progress.update(totalSize, { speed: 'N/A' });
        progress.stop();
        console.log(`Torrent ${index + 1} download finished: ${torrent.name}`);
      });

      torrent.on('error', (err) => {
        console.log(`Error downloading torrent ${index + 1}: ${torrent.name}`, err);
      });

      progress.start(totalSize, 0, { speed: 'N/A' });
    });
  });
};

const getReadableSpeed = (speed) => {
  if (speed < 1024) {
    return `${speed/ (1024 * 1024 * 1024).toFixed(2)} B/s`;
  } else if (speed < 1024 * 1024) {
    return `${(speed / 1024).toFixed(2)} KB/s`;
  } else {
    return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;
  }
};

downloadTorrents();
