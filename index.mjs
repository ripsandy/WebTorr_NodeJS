import WebTorrent from 'webtorrent-hybrid';
import { SingleBar, Presets } from 'cli-progress';

const client = new WebTorrent();
const magnetURI = 'magnet:?xt=urn:btih:7D95F5D6F6C1159255BBF7A939F10B8961EED07A&dn=John+Wick%3A+Chapter+4+2023+1080p+WEBRip+10Bit+DDP5.1+x265-Asiimov&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Feddie4.nl%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce';

if (!magnetURI) {
  console.error('Please provide a valid magnet URI as a command-line argument.');
  process.exit(1);
}

const progress = new SingleBar({
  format: 'Progress |{bar}| {percentage}% | ETA: {eta}s | {value}/{total} MB',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
}, Presets.shades_classic);

client.add(magnetURI, { path: './downloads' }, (torrent) => {
  console.log('Downloading: ' + torrent.name);
  const totalSize = torrent.length / 1000000;
  progress.start(totalSize, 0, { speed: 'N/A' });

  torrent.on('download', (bytes) => {
    const downloaded = torrent.downloaded / 1000000;
    progress.update(downloaded, { speed: `${torrent.downloadSpeed / 1000} KB/s` });
  });

  torrent.on('done', () => {
    progress.update(totalSize, { speed: `${torrent.downloadSpeed / 1000} KB/s` });
    progress.stop();
    console.log('\nTorrent download finished!');
  });

  torrent.on('error', (err) => {
    console.log('Error downloading torrent:', err);
  });
});
