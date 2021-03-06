const path = require('path');
const electron = require('electron');
const app = electron.app;
// Module to create tray icon
const Tray = electron.Tray;

const MenuItem = electron.MenuItem;
var appIcon = null;

exports.create = function(win, config) {
	if (process.platform === 'darwin' || appIcon || config.get('window_display_behavior') === 'show_taskbar' ) return;

	const icon = process.platform === 'linux' || process.platform === 'darwin' ? 'IconTray.png' : 'Icon.ico';
	const iconPath = path.join(__dirname, `../resources/${icon}`);

	const contextMenu = electron.Menu.buildFromTemplate([
		{
			 label: 'Show/Hide Window'
			,click() {
				win.webContents.executeJavaScript('ipc.send("toggleWin", false);');
			}
		},
		{
			type: 'separator'
		},
		{
			 label: 'Quit'
			,click() {
				app.quit();
			}
		}
	]);

	appIcon = new Tray(iconPath);
	appIcon.setToolTip('Rambox');
	appIcon.setContextMenu(contextMenu);
	appIcon.on('double-click', function() {
		win.webContents.executeJavaScript('ipc.send("toggleWin", true);');
	});
};

exports.destroy = function() {
	if (appIcon) appIcon.destroy();
	appIcon = null;
};

exports.setBadge = function(messageCount, showUnreadTray) {
	if (process.platform === 'darwin' || !appIcon) return;

	let icon;
	if (process.platform === 'linux') {
		icon = messageCount && showUnreadTray ? 'IconTrayUnread.png' : 'IconTray.png';
	} else {
		icon = messageCount && showUnreadTray ? 'IconTrayUnread.ico' : 'Icon.ico';
	}

	const iconPath = path.join(__dirname, `../resources/${icon}`);
	appIcon.setImage(iconPath);
};
