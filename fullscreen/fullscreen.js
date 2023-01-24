import { createJWT } from '../utils';

(async function() {
  let iframes = [];

  const authOptions = {
    auth: {
      name: 'Mario Rossi',
      email: 'mario.rossi@email.it',
      country: 'IT',
    },
    unauth: {
      country: 'IT'
    }
  }

  const fullscreenBtn = document.querySelector("#fullscreen-btn");

  fullscreenBtn.addEventListener("click", handleGoFullscreen);

  function handleGoFullscreen() {
    addIFrame().then((iframe) => {
      initializeIFrame(iframe);
    });
    addCloseIcon();
  };

  function addCloseIcon() {
    const closeIcon = document.createElement("span");
    const textContent = document.createTextNode("X");
    closeIcon.appendChild(textContent);

    closeIcon.classList.add("iframe-close-icon");

    document.querySelector("main").appendChild(closeIcon);

    closeIcon.addEventListener("click", handleClickCloseIFrame);
    document.addEventListener("keydown", handleKeydownCloseIFrame);
  };

  async function addIFrame() {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", "https://armani-shop-localhost.tailoor.com:3020");
    iframe.setAttribute("frameborder", 0);
    iframe.classList.add("iframe-active");
    document.querySelector("main").appendChild(iframe);
    return iframe;
  };

  function handleClickCloseIFrame() {
    if (!iframes.length) return;
    iframes[0].iFrameResizer.close();
    document.querySelector(".iframe-close-icon").remove();
  };

  function handleKeydownCloseIFrame(event) {
    if (!iframes.length || event.keyCode !== 27) return;
    iframes[0].iFrameResizer.close();
    document.querySelector(".iframe-close-icon").remove();
  };

  const jwt = await createJWT(authOptions.unauth);

  function initializeIFrame(iframeElement) {
    const options = {
      log: false,
      checkOrigin: false,
      onInit: (iframe) => {
        console.log('*** on init ->', iframe);
        if (!iframes.length) {
          console.warn('*** no iframe found?');
          return;
        };
        // browser native postMessage api
        iframe.contentWindow.postMessage({
          type: 'auth',
          message: jwt
        }, "*");
      }
    };
    iframes = iFrameResize(options, iframeElement);
  };

})();

