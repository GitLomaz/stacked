// Set the name of the hidden property and the change event for visibility
var hidden, visibilityChange, visibilityDate;
if (typeof document.hidden !== "undefined") {
  // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (scene && !scene.tutorialMode) {
    if (document[hidden]) {
      if (MOBILE) {
        scene.musicController.stop();
      }
      visibilityDate = Date.now();
    } else {
      if (MOBILE) {
        scene.musicController.play();
      }
      if (!visibilityDate) {
        visibilityDate = Date.now();
      }
      now = Date.now();
      offlineTime = Math.floor((now - visibilityDate) / 1000);
      readable = new Date(offlineTime * 1000).toISOString().substr(11, 8);
      // if (offlineTime > 30) {
      promptBackgroundProgress(readable, offlineTime);
      // }
      _.each(scene.skills, function (s) {
        s.setAnimationFrame();
      });
    }
  }
}

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || hidden === undefined) {
  console.log(
    "This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."
  );
} else {
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}
