let _browserWindow = null;

exports.getBrowserWindow = function() {
  return _browserWindow;
};

exports.setBrowserWindow = function(browserWindow) {
  _browserWindow = browserWindow;
};