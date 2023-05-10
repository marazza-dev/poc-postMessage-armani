import { createJWT } from '../utils';

(async function() {
  // const iframeSrc = "https://armani-shop-staging.tailoor.com/embed/appointment";
  // const iframeSrc = "https://armani-shop.tailoor.com/embed"
  const iframeSrc = "https://armani-shop-localhost.tailoor.com:3020/embed/appointment";
  let iframes = [];
  const dialog = document.querySelector('dialog');
  const dialogButton = document.querySelector('#dialog-btn');

  // Treat this as a authentication flag
  // it can be eighter 'auth' | 'unauth'
  dialog.returnValue = 'unauth';
  let isUserAuth = false;

  function openDialog() {
    dialog.showModal();
  }

  const authOptions = {
    auth: {
      name: 'Mario',
      surname: 'Rossi',
      email: 'mario.rossi@email.it',
      country: 'it',
      language: 'it',
    },
    unauth: {
      country: 'it',
      language: 'it',
    }
  }

  const iframe = await addIFrame();
  initializeIFrame(iframe);

  const fullscreenBtn = document.querySelector("#fullscreen-btn");

  fullscreenBtn.addEventListener("click", handleGoFullscreen);

  async function handleGoFullscreen() {
    document.querySelector('.iframe-container').classList.remove('hidden');
    document.querySelector('.iframe-container').classList.add('visible');
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
    document.querySelector(".iframe-container").appendChild(iframe);
    return iframe;
  };

  function handleCloseDialogClick(e) {
    dialog.returnValue = e.target.value;
    isUserAuth = true;
  }

  function handleOnCloseDialog(iframe) {
    if (!iframe) return;
    if (dialog.returnValue === 'auth' || isUserAuth) {
      createAndSendAuth(dialog.returnValue, iframe.contentWindow);
    }
  }

  function handleClickCloseIFrame() {
    if (!iframes.length) return;
    // iframes[0].iFrameResizer.close();
    document.querySelector('.iframe-container').classList.remove('visible');
    document.querySelector('.iframe-container').classList.add('hidden');
    document.querySelector(".iframe-close-icon").remove();
  };

  function handleKeydownCloseIFrame(event) {
    if (!iframes.length || event.keyCode !== 27) return;
    // iframes[0].iFrameResizer.close();
    document.querySelector('.iframe-container').classList.remove('visible');
    document.querySelector('.iframe-container').classList.add('hidden');
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
      checkOrigin: [
        'https://localhost:5173',
        'https://armani-shop-localhost.tailoor.com:3020',
        'https://armani-shop-staging.tailoor.com',
        'https://armani-shop.tailoor.com',
      ],
      // checkOrigin: false,
      onInit: () => {
        if (!iframes.length) {
          console.warn('*** no iframe found?');
          return;
        };
        console.log('~~~ onInit fired');
      },
      onClose: () => {
        isUserAuth = false;
        dialog.returnValue = 'unauth';
        return true;
      }
    };
    iframes = iFrameResize(options, iframeElement);

  };

  window.addEventListener('message', (event) => {
    if (event.data?.type === "request-auth") {
      console.log('*** PARENT RECEIVED request-auth message -> ', event);
      if (dialog.returnValue === 'unauth') {
        openDialog();
      }
    };

    if (event.data?.type === "ready") {
      // send auth message to Tailoor
      console.log('~~~ ready event fired');
      createAndSendAuth(isUserAuth ? 'auth' : 'unauth', iframes[0].contentWindow);
    }
  });

  dialogButton.addEventListener('click', handleCloseDialogClick);
  dialog.addEventListener('close', () => { handleOnCloseDialog(iframes[0]) }, false);

})();

