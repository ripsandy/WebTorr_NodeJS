import WebTorrent from 'webtorrent-hybrid';
import cliProgress from 'cli-progress';

const client = new WebTorrent();

const createTorrentClient = async (magnetURIs) => {
  const torrents = magnetURIs.map((magnetURI) => {
    return new Promise((resolve, reject) => {
      const torrent = client.add(magnetURI, (torrent) => {
        console.log(`Downloading: ${torrent.name}`);

        const progressBar = new cliProgress.SingleBar({
          format: `Progress (${torrent.name}): [{bar}] {percentage}% | Speed: {speed}`,
          stopOnComplete: true,
        });

        torrent.on('download', (bytes) => {
          progressBar.update(torrent.progress * 100, {
            speed: getReadableSpeed(torrent.downloadSpeed),
          });
        });

        torrent.on('done', () => {
          console.log(`Torrent download finished: ${torrent.name}`);
          progressBar.stop();
          resolve();
        });

        torrent.on('error', (err) => {
          console.error(`Error downloading torrent: ${torrent.name}`, err);
          progressBar.stop();
          reject(err);
        });

        progressBar.start(100, 0, {
          speed: getReadableSpeed(torrent.downloadSpeed),
        });
      });
    });
  });

  await Promise.all(torrents);
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

export { createTorrentClient };