import { createJWT } from "./utils";

(async function() {
  const dialog = document.querySelector('dialog');
  dialog.returnValue = 'unauth';
  const dialogButton = document.querySelector('#dialog-btn');

  function openDialog() {
    dialog.showModal();
  }

  dialogButton.addEventListener('click', (e) => {
    dialog.returnValue = e.target.value;
  })

  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'auth') {
      createAndSendAuth(dialog.returnValue);
    }
  })

  const authOptions = {
    auth: {
      name: 'Mario',
      surname: 'Rossi',
      email: 'mario.rossi@email.it',
      country: 'IT',
    },
    unauth: {
      country: 'IT',
    }
  }

  addIFrame().then((iframe) => {
    initializeIFrame(iframe);
  });

  async function addIFrame() {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", "https://armani-shop-localhost.tailoor.com:3020");
    iframe.setAttribute("frameborder", 0);
    document.querySelector("main").appendChild(iframe);
    return iframe;
  };

  function initializeIFrame(iframeElement) {
    const options = {
      log: false,
      heightCalculationMethod: 'bodyOffset',
      checkOrigin: false,
    };

    iFrameResize(options, iframeElement);
  }


  const iframe = document.querySelector('iframe');
  async function createAndSendAuth(option, source = iframe.contentWindow) {
    const jwt = await createJWT(authOptions[option]);
    source.postMessage({
      type: 'auth',
      message: jwt,
    }, '*');
  }

  window.addEventListener("message", (event) => {
    // console.log('*** PARENT RECEIVED message -> ', event);
    // TODO -> abstract this handler into its own class
    if (event.data?.type === "ready") {
      console.log('*** PARENT - Received ready event');
      createAndSendAuth(dialog.returnValue, event.source);
      return
    }

    if (event.data?.type === "request-auth") {
      console.log('*** PARENT RECEIVED request-auth message -> ', event);
      if (dialog.returnValue === 'unauth') {
        openDialog();
      }
    }
  }, false);

})();
