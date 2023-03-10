## iframe-resizer config
Check the official documentation [here](https://github.com/davidjbradshaw/iframe-resizer) for a detailed explanation of the available options.

>In production `checkOrigin` should be set for security reasons

### 'In page' solution:
```js
const options = {
	log: false,
	heightCalculationMethod: 'bodyOffset',
	checkOrigin: false,
};

iFrameResize(options, iframeElement);
```

### 'Fullscreen' solution:
```js
const options = {
	log: false,
	checkOrigin: false,
	onInit: (iframe) => {
		// Use this callback for initial operations.
		// The callback will be fired once iframeResizer.contentWindow has responded to the init message from the parent window
	}
};

iFrameResize(options, iframeElement);
```
### Setting the language
For both the above solutions, the parent page has 2 options when it comes to setting the language inside of Tailoor.
1. Set the iframe `src` attribute to a localized home page:
  ```js
  // for english
  iframe.setAttribute('src', 'https://production-endpoint.tailoor.com/en');

  // for italian
  iframe.setAttribute('src', 'https://production-endpoint.tailoor.com/it');
  ```
2. Set the iframe `src` attribute to our custom middlaware page (`/embed`) and pass a language property inside the JWT payload. See [below](#message-structure) for more details on how to pass the language property via JWT.
  ```js
  iframe.setAttribute('src', 'https://production-endpoint.tailoor.com/embed')  
  ```

## postMessage comunication strategy
Browser native `postMessage` API will be used as a comunication layer between the parent page (YNAP) and the iframed page (Tailoor).
The `sendMessage` method from iframe-resizer is not recommended since a deserialization bug,  makes passing objects very hard when it isn't used in conjunction with `onMessage`.

### From the parent page:
Once the iframe element is loaded and iframe-resizer is initialized, you can send messages to the iframed page as follow:
```js
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage(...);
```

### Message structure
Once Tailoor is fully loaded, it will start listening for `message` events. Events that don't comply with the types and structures documented here will be ignored.

***Tailoor is listening for:***
- `type: 'auth'`
	Used to send Tailoor the user informations.
```ts
	interface Message {
		type: string,
		message: string
	}

	const message = {
		type: 'auth',
		message: jwt
	}

	iframe.contentWindow.postMessage(message, targetOrigin);
```

The JSON Web Token should contain the following payload:
- Authenticated user:
```ts
interface JWTPayload {
	name: string,
	surname: string,
	email: string,
	country: string, // ISO 3166-2 country code
  language?: string // ISO 639-1 language code
}
```
- Anonymous user:
```ts
interface JWTPayload {
	country: string, // ISO 3166-2 country code
  language?: string // ISO 639-1 language code
}
```
> Note that the `language` property is optional, and only needed if the iframe src is pointing to the middleware page `/embed`.
> If you choose to use the localized path as iframe src (`/en`, `/it`, etc...), you should not pass the language inside the JWT payload.

- `type: 'logout'`
 Used to logout user from Tailoor. It causes Tailoor to clear the user object state hold in memory 
```ts
interface Message {
  type: string
}
```
---
***Parent is listening for:***
- `type: 'ready'`
	This event is emitted once Tailoor is fully loaded and ready to handle message events.
```ts
interface Message {
	type: string
}
```

- `type: 'request-auth'`
	Tailoor will emit this type of event to request for the user authentication. Parent should respond with a message `type: 'auth'` and the JWT
```ts
interface Message {
	type: string
}
```
