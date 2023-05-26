import WebTorrent from 'webtorrent-hybrid';
import cliProgress from 'cli-progress';

const client = new WebTorrent();
const multiBar = new cliProgress.MultiBar({
  format: 'Progress | {bar} | {percentage}% | ETA: {eta_formatted} | Speed: {speed}',
  hideCursor: true,
});

const downloadTorrents = (magnetURIs) => {
  const bars = [];

  magnetURIs.forEach((magnetURI) => {
    const bar = multiBar.create(0, 0, { speed: '0 B/s' });
    bars.push(bar);

    client.add(magnetURI, (torrent) => {
      bar.setTotal(torrent.length);

      torrent.on('download', (bytes) => {
        const percent = (torrent.progress * 100).toFixed(2);
        const speed = getReadableSpeed(torrent.downloadSpeed);

        bar.update(torrent.downloaded, { speed });
        console.log(`Progress (${magnetURI}): ${percent}% downloaded | Speed: ${speed}`);
      });

      torrent.on('done', () => {
        bar.update(torrent.length, { speed: getReadableSpeed(torrent.downloadSpeed) });
        console.log(`Torrent download finished: ${torrent.name}`);
        bar.stop();
      });

      torrent.on('error', (err) => {
        console.error(`Error downloading torrent: ${torrent.name}`, err);
        bar.stop();
      });
    });
  });

  client.on('torrent', (torrent) => {
    torrent.on('done', () => {
      const completedTorrents = magnetURIs.filter((magnetURI) => {
        const t = client.get(magnetURI);
        return t && t.done;
      });

      if (completedTorrents.length === magnetURIs.length) {
        multiBar.stop();
      }
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

// Example usage
const magnetURIs = [
  'magnet:?xt=urn:btih:7D95F5D6F6C1159255BBF7A939F10B8961EED07A&dn=John+Wick%3A+Chapter+4+2023+1080p+WEBRip+10Bit+DDP5.1+x265-Asiimov&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Feddie4.nl%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce',
  'magnet:?xt=urn:btih:3E273AAF9E8AE9AEEA55798A083BD5DF2B1DDD47&dn=The.Popes.Exorcist.2023.2160p.WEB-DL.DD5.1.DV.HDR.H.265-APEX%5BTGx%5D&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fopentor.org%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2970%2Fannounce&tr=https%3A%2F%2Ftracker.foreverpirates.co%3A443%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce'
];

downloadTorrents(magnetURIs);
