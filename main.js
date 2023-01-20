
(async function() {

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
      onInit: (iframe) => {
        iframe.contentWindow.postMessage({
          type: 'auth',
          message: { name: 'Name', email: 'Email' },
        }, "*")
      }
    };

    iFrameResize(options, iframeElement);
  }

})();
