import { createJWT } from "./utils";

(async function() {
  const authOptions = {
    auth: {
      name: 'Mario Rossi',
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

  
  const jwt = await createJWT(authOptions.auth);

  console.log(jwt)

  window.addEventListener("message", (event) => {
    // TODO -> abstract this handler into its own class
    if (event.data?.type === "ready") {
      console.log('*** PARENT - Received ready event');
      event.source.postMessage({
        type: 'auth',
        message: jwt,
      }, '*');
    }
  }, false);

})();
