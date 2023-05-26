import WebTorrent from 'webtorrent-hybrid';
import { SingleBar, Presets } from 'cli-progress';

const client = new WebTorrent();
const magnetURIs = [
  'magnet:?xt=urn:btih:3E273AAF9E8AE9AEEA55798A083BD5DF2B1DDD47&dn=The.Popes.Exorcist.2023.2160p.WEB-DL.DD5.1.DV.HDR.H.265-APEX%5BTGx%5D&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fopentor.org%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2970%2Fannounce&tr=https%3A%2F%2Ftracker.foreverpirates.co%3A443%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce',
  'magnet:?xt=urn:btih:7D95F5D6F6C1159255BBF7A939F10B8961EED07A&dn=John+Wick%3A+Chapter+4+2023+1080p+WEBRip+10Bit+DDP5.1+x265-Asiimov&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Feddie4.nl%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce' // Add more magnet URIs here
];

if (magnetURIs.length === 0) {
  console.error('Please provide at least one magnet URI.');
  process.exit(1);
}

const progressBars = [];

const downloadTorrents = () => {
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
    return `${speed.toFixed(2)} B/s`;
  } else if (speed < 1024 * 1024) {
    return `${(speed / 1024).toFixed(2)} KB/s`;
  } else {
    return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;
  }
};

downloadTorrents();
