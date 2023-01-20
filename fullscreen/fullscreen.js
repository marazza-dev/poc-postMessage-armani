import * as jose from '../node_modules/jose';

(async function() {
  let iframes = [];
  console.log('Initial iframes', iframes);

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

  // create JWT
  const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
  );
  const alg = 'HS256';
  const jwt = await new jose.SignJWT({ 'name': 'Nome Cognome', 'email': 'email@email.it' })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .setSubject('user:id:test')
    .sign(secret)

  console.log(jwt)

  const { payload } = await jose.jwtVerify(jwt, secret, {
    issuer: 'urn:example:issuer',
    audience: 'urn:example:audience',
  });

  console.log('decoded jwt', { payload });

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
        // iframe-resizer sendMessage method
        //
        // iframes[0].iFrameResizer.sendMessage({
        //   type: 'auth',
        //   payload: {
        //     'name': payload.name,
        //     'email': payload.email
        //   }
        // }, '*')

        // browser native postMessage api
        iframe.contentWindow.postMessage({
          type: 'auth',
          message: {
            name: payload.name,
            email: payload.email
          }
        }, "*");
      }
    };
    iframes = iFrameResize(options, iframeElement);
  };

})();

