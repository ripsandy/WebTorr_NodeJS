# WebTorr Downloader using NodeJS - Multiple Torrents

Before running `npm install webtorrent-hybrid cli-progress`, it is important to install the dependencies `pre-node-gyp` and `node-gyp`. These packages are required for successful installation of `webtorrent-hybrid` which is a native Node.js module.

## Prerequisites

Make sure you have Node.js installed on your system before running this script.

## Getting Started

To use this script, follow these steps:

1. Install `pre-node-gyp` globally by running the following command:

2. Install `node-gyp` globally by running the following command:

**Note:** `node-gyp` requires additional system dependencies. Refer to the official `node-gyp` documentation for installation instructions specific to your operating system: [node-gyp installation](https://github.com/nodejs/node-gyp#installation)

3. Install the necessary dependencies by running the following command in your project directory:

4. Replace the placeholder magnet URIs in the `magnetURIs` array with the actual magnet URIs of the torrents you want to download. You can add or remove magnet URIs as needed.

5. Run the script using the following command:
Replace `<filename>` with the name of the file where you've saved this code.

## Functionality

The script initializes a WebTorrent client and utilizes the `webtorrent-hybrid` and `cli-progress` libraries to download torrents. It allows you to provide a list of magnet URIs and download the corresponding torrents to a specified directory.

## Customization

You can customize the behavior of the progress bar by modifying the `format`, `barCompleteChar`, `barIncompleteChar`, and `hideCursor` options passed to the `SingleBar` constructor.

## Note

- Installing `pre-node-gyp` and `node-gyp` globally is necessary to ensure a successful installation of the `webtorrent-hybrid` dependency.
- Please make sure to follow the installation instructions for `node-gyp` specific to your operating system to satisfy the required system dependencies.
- Remember to handle any potential errors and customize the script according to your specific requirements.


