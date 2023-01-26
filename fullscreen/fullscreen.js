import { createJWT } from '../utils';

(async function() {
  const iframeSrc = "https://armani-shop-staging.tailoor.com";
  let iframes = [];
  const dialog = document.querySelector('dialog');
  const dialogButton = document.querySelector('#dialog-btn');
  dialog.returnValue = 'unauth';

  function openDialog() {
    dialog.showModal();
  }

  const authOptions = {
    auth: {
      name: 'Mario',
      surname: 'Rossi',
      email: 'mario.rossi@email.it',
      country: 'IT',
    },
    unauth: {
      country: 'IT'
    }
  }

  const fullscreenBtn = document.querySelector("#fullscreen-btn");

  fullscreenBtn.addEventListener("click", handleGoFullscreen);

  async function handleGoFullscreen() {
    const iframe = await addIFrame();
    initializeIFrame(iframe);
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
    iframe.setAttribute("src", iframeSrc);
    iframe.setAttribute("frameborder", 0);
    iframe.classList.add("iframe-active");
    document.querySelector("main").appendChild(iframe);
    return iframe;
  };

  function handleCloseDialogClick(e) {
    dialog.returnValue = e.target.value;
  }

  function handleOnCloseDialog(iframe) {
    if (dialog.returnValue === 'auth') {
      createAndSendAuth(dialog.returnValue, iframe.contentWindow);
    }
  }

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

  async function createAndSendAuth(option, source) {
    const jwt = await createJWT(authOptions[option]);
    source.postMessage({
      type: 'auth',
      message: jwt,
    }, '*');
  }

  function initializeIFrame(iframeElement) {
    const options = {
      log: false,
      checkOrigin: false,
      onInit: (iframe) => {
        if (!iframes.length) {
          console.warn('*** no iframe found?');
          return;
        };
        // browser native postMessage api
        createAndSendAuth(dialog.returnValue, iframe.contentWindow);

        dialogButton.addEventListener('click', handleCloseDialogClick);
        dialog.addEventListener('close', () => { handleOnCloseDialog(iframe) });
      }
    };
    iframes = iFrameResize(options, iframeElement);

  };



  window.addEventListener('message', (event) => {
    console.log('*** PARENT RECEIVED message -> ', event);
    if (event.data?.type === "request-auth") {
      console.log('*** PARENT RECEIVED request-auth message -> ', event);
      if (dialog.returnValue === 'unauth') {
        openDialog();
      }
    }
  })

})();

