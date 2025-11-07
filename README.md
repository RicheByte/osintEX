# OSINTEX Browser Extension

A powerful browser extension providing quick access to 525+ OSINT and hacker search engines. Search, categorize, and save your favorite tools.

![OSINTEX Extension](icons/icon128.png)

## Features

- 🔍 **525+ Search Engines** - Access to all major OSINT and security research tools
- 📂 **25 Categories** - Organized by use case (Vulnerabilities, Exploits, Threat Intel, etc.)
- ⭐ **Favorites System** - Save your most-used search engines
- 🔎 **Powerful Search** - Search by name, description, or URL
- 🎨 **Modern UI** - Clean, dark-themed interface
- ⚡ **Fast & Lightweight** - Instant access from your browser toolbar
- 🔄 **Cross-Browser** - Works on Chrome, Edge, Brave, and Firefox


![Demo video](/assets/video.gif)

## Installation

### Chrome / Edge / Brave (Chromium-based browsers)

1. **Download the extension**
   - Download or clone this repository
   - Navigate to the `extension` folder

2. **Enable Developer Mode**
   - Open your browser and go to the extensions page:
     - Chrome: `chrome://extensions`
     - Edge: `edge://extensions`
     - Brave: `brave://extensions`
   - Toggle **Developer mode** in the top-right corner

3. **Load the extension**
   - Click **Load unpacked**
   - Select the `extension` folder from this project
   - The OSINTEX icon should appear in your browser toolbar

### Firefox

1. **Download the extension**
   - Download or clone this repository
   - Navigate to the `extension` folder

2. **Temporary Installation (for testing)**
   - Open Firefox and go to `about:debugging`
   - Click **This Firefox**
   - Click **Load Temporary Add-on**
   - Navigate to the `extension` folder and select `manifest.json`

3. **Permanent Installation**
   - For permanent installation, you'll need to sign the extension through Mozilla
   - Alternatively, use Firefox Developer Edition or unbranded builds for unsigned extensions

## Usage

### Basic Navigation

1. **Click the OSINTEX icon** in your browser toolbar to open the extension
2. **Choose a tab**:
   - **All** - Browse all search engines organized by category
   - **Favorites** - Quick access to your saved favorites
   - **Categories** - Grid view of all categories

### Search

- Use the search bar at the top to filter search engines
- Search works across names, descriptions, and URLs
- Click the **×** button to clear your search

### Adding Favorites

- Click the **star icon** next to any search engine to add it to favorites
- Favorites are synced across your devices (if browser sync is enabled)
- Access all favorites quickly from the **Favorites** tab

### Opening Search Engines

- Click on any search engine card to open it in a new tab
- The extension stays open for quick access to multiple tools

### Category View

1. Go to the **Categories** tab
2. Click on any category card to see all search engines in that category
3. Use the **Back to Categories** button to return to the grid

## Categories

The extension includes these categories:

- General Search Engines
- Servers
- Vulnerabilities
- Exploits
- Attack Surface
- Code
- Email Addresses
- Domains
- URLs
- DNS
- Certificates
- WiFi Networks
- Device Information
- Credentials
- Leaks
- Hidden Services
- Social Networks
- Phone Numbers
- Images
- Threat Intelligence
- Web History
- Files
- Surveillance Cameras
- Crypto
- People

## Data Source

This extension is based on the [Awesome Hacker Search Engines](https://github.com/edoardottt/awesome-hacker-search-engines) repository by [edoardottt](https://github.com/edoardottt).

## Development


### Updating Data

To update the search engines data:

1. Update the main `README.md` file with new search engines
2. Run the parser script:
   ```bash
   python parse_readme.py
   ```
3. Copy the new `data.json` to the extension folder:
   ```bash
   copy data.json extension/data.json
   ```
4. Reload the extension in your browser

### Customizing Icons

To regenerate icons with different designs:

1. Edit `create_icons.py`
2. Run the script:
   ```bash
   python create_icons.py
   ```

## Privacy

- **No data collection** - This extension does not collect any personal data
- **Local storage only** - Favorites are stored locally in your browser
- **No external requests** - All data is bundled with the extension
- **Open source** - Full source code available for review

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

To add new search engines, update the main `README.md` following the existing format.

## License

This project uses data from [Awesome Hacker Search Engines](https://github.com/edoardottt/awesome-hacker-search-engines).

## Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Original List**: [edoardottt/awesome-hacker-search-engines](https://github.com/edoardottt/awesome-hacker-search-engines)

## Changelog

### Version 1.0.0
- Initial release
- 525+ search engines across 25 categories
- Favorites system with sync storage
- Real-time search filtering
- Category browsing
- Modern dark-themed UI
- Cross-browser support (Chrome, Firefox, Edge, Brave)

---

**Made with ❤️ for the OSINT and security research community**
