## [Unreleased]

### Changed
- The `continue(scene: IScene, msg: IMessage): boolean` method of middleware now accepts parameters similar to the `guard()` method.
- Class `SubscriberContext` renamed to `SceneContext` because it's possible to create instance everywhere but not only use in the context of subscribers handlers.
- The `getSceneSubscribers(filter?: ISubscribersFilter)` method removed in favor to `getSubscribers()` without parameters — you can filter result list outside by yourself.

  Example of using updated `continue()` method, new `SceneContext` class and its method `getSubscribers()` together to determine that at least one subscriber handlers was matched:
  ```ts
  import { MessageMiddleware, SceneContext, IScene, IMessage } from 'botist';

  export default class CustomMiddleware extends MessageMiddleware {
      public continue(_scene: IScene, msg: IMessage): boolean {
          const middleware = new SceneContext(this, msg);
          // Move to next middleware only when no one handler of the current middleware has been matched.
          return !middleware.getSubscribers().some(middleware.match);
      }

      public subscribe(): void {
          this.text('/foo', () => {});
          this.text('/bar', () => {});
      }
  }
  ```

### Added
- Added possibility to use function as a matcher of `text()` subscriber:

  ```ts
  import { MainScene, ITextMessage } from 'botist';

  class Main extends MainScene {
    private static commands: string[] = ['/foo', '/bar'];

    public subscribe() {
      this.text(
        (msg: ITextMessage) => {
          // matcher
          return Main.commands.includes(msg.text);
        },
        (msg: ITextMessage) => {
          // handler
        },
      );
    }
  }
  ```

- Added work with polls. Currently it's supported only for the Telegram.

  Example of sending new poll to the user:
  ```ts
  const integration = bot.getAdapter('Telegram');
  if (integration) {
    integration.sendPoll('123456789', {
      question: 'How are you?',
      options: [
        'Fine',
        'Good',
        'Cool',
      ],
    });
  }
  ```

  It's need to be careful with processing responses of a questions because user can choose an option at any moment from any scene. Generally handling of responses should be performed inside special middleware.
  ```ts
  import {
    MessageMiddleware,
    SceneContext,
    IPollMessage,
    IScene,
    IMessage,
  } from 'botist';

  class PollsMiddleware extends MessageMiddleware {
      public continue(_scene: IScene, msg: IMessage): boolean {
          const middleware = new SceneContext(this, msg);
          return !middleware.getSubscribers().some(middleware.match);
      }

      public subscribe(): void {
          // Handling all responses to the polls.
          this.poll(() => true, (msg: IPollMessage) => {
              console.log(`User ${msg.pollId} chose ${msg.answers.join()}`);
          });
      }
  }

  bot.beforeScene(new PollsMiddleware(bot));
  ```

## 0.8.0 (July 8, 2020)

### Changed
- Property `name` renamed to `adapter` in message object.

### Added
- Created `chatId` and `messageType` properties to the error object of sending messages methods.

  Example of catching error on the place after trying to send text message:
  ```ts
  import { Botist, MainScene, Telegram } from 'botist';
  import SendError from 'botist/lib/Errors/SendError';

  const bot = new Botist({
    port: 5555,
    scene: class extends MainScene {
      public subscribe() {}
    },
  });

  bot.adapter(new Telegram('token', 'webHookUrl'));

  const integration = bot.getAdapter('Telegram');
  if (integration) {
    integration.sendText('123456789', 'Hello!').catch((err: SendError) => {
    console.log(err);
    // SendError: Telegram with StatusCodeError 403. Forbidden: bot was blocked by the user
    // {
    //   adapter: 'Telegram',
    //   chatId: '123456789',
    //   messageType: 'text',
    //   type: 'StatusCodeError',
    //   text: 'Forbidden: bot was blocked by the user',
    //   code: 403,
    //   statusCode: 403
    // }
    });
  }
  ```

  The error will not be thrown on the place when global handler is declared because it will intercept all errors.
  Example of catching error by global handler:
  ```ts
  import { Botist, MainScene, Telegram } from 'botist';
  import SendError from 'botist/lib/Errors/SendError';

  const bot = new Botist({
    port: 5555,
    scene: class extends MainScene {
      public subscribe() {}
    },
    catch: (err: SendError) => {
      console.log(err);
      // SendError: Telegram with StatusCodeError 403. Forbidden: bot was blocked by the user
    }
  });

  bot.adapter(new Telegram('token', 'webHookUrl'));

  const integration = bot.getAdapter('Telegram');
  if (integration) {
    integration.sendText('123456789', 'Hello!');
  }
  ```

- Added the ability to declare middlewares for catching errors.

  Example of catch-middleware declaration and using:
  ```ts
  // file: ForbiddenMiddleware.ts
  import { CatchMiddleware } from 'botist';
  import SendError from 'botist/lib/Errors/SendError';

  export class ForbiddenMiddleware extends CatchMiddleware {
    public catch(err: SendError): boolean {
      if (error.code === 403) {
        console.log(err);
        // SendError: Telegram with StatusCodeError 403. Forbidden: bot was blocked by the user

        // Returns true for prevent calling next middleware and global handler or on the place handler.
        return true;
      }

      // Error was't handled by this middleware.
      return false;
    }
  }
  ```

  ```ts
  // file: index.ts
  import { Botist, MainScene, Telegram } from 'botist';
  import { ForbiddenMiddleware } from './ForbiddenMiddleware';

  const bot = new Botist({
    port: 5555,
    scene: class extends MainScene {
      public subscribe() {}
    },
    catch: () => {
      // Will not invoked on error with code 403
      // because the error will intercepted by ForbiddenMiddleware.
    }
  });

  bot.adapter(new Telegram('token', 'webHookUrl'));

  const integration = bot.getAdapter('Telegram');
  if (integration) {
    integration.sendText('123456789', 'Hello!');
  }
  ```

## 0.7.0 (May 17, 2020)

### Added
- Added `next()` function as third parameter of message handler.

  The `next()` function allows you to call the next matching message handler within a scene or middleware. You can use asynchronous handlers as usual. In the following example of main scene, both handlers will be called:
  ```ts
  import { MainScene } from 'botist';

  export class Main extends MainScene {
    public subscribe(): void {
      this.text(/.*/, (msg, res, next) => {
        console.log('first handler');
        next();
      });

      this.text(/.*/, () => {
        console.log('second handler');
      });
    }
  }
  ```

- Added the ability to declare middlewares for message which called before the current scene handlers and after them.

  Example of middleware declaration and using:
  ```ts
  // file: middleware.ts
  import { MessageMiddleware } from 'botist';

  export class Middleware extends MessageMiddleware {
    public subscribe(): void {
      this.text(/.*/, (msg, res, next) => {
        console.log('1');
        next();
      });

      this.text(/.*/, () => {
        console.log('2');
      });
    }
  }
  ```

  ```ts
  // file: index.ts
  import { Botist, MainScene, Telegram } from 'botist';
  import { Middleware } from './middleware';

  const bot = new Botist({
      port: 5555,
      scene: class Main extends MainScene {
        public subscribe() {
          this.text(/.*/, async () => {
            console.log('3');
          });
        }
      },
  });

  bot.beforeScene(new Middleware(bot)); // Prints: '1', '2'.
  // Prints '3' from main scene.
  bot.afterScene(new Middleware(bot)); // Prints: '1', '2' again.

  bot.adapter(new Telegram('token', 'webHookUrl'));
  ```

- Added ability to prevent calling message handlers after current middleware.

  Sometimes you need to prevent calling message handlers of the next middleware or current scene. You can achieve this by declare `continue()` method which returns `false`. Middleware from the following example, added to `beforeScene()` will prevent all message handlers of the main scene from being called:

  ```ts
  import { MessageMiddleware } from 'botist';

  export class Middleware extends MessageMiddleware {
    public subscribe(): void {
      this.text(/.*/, (msg, res) => {
        // ...
      });
    }

    public continue(): boolean {
      return false;
    }
  }
  ```

- Added ability to restrict applying middleware handlers.

  Sometimes you need to apply middleware only for certain scene or message. You can achieve this by declare `guard()` method which returns `false`. Middleware from the following example will be applying only after main scene:

  ```ts
  // file: middleware.ts
  import { Botist, MessageMiddleware, MainScene, IScene, IMessage } from 'botist';

  export class Middleware extends MessageMiddleware {
    constructor(bot: Botist, private TargetScene: typeof MainScene) {
      super(bot);
    }

    public guard(scene: IScene, msg: IMessage): boolean {
      return scene instanceof this.TargetScene;
    }

    public subscribe(): void {
      this.text(/.*/, (msg, res, next) => {
        // ...
      });
    }
  }
  ```

  ```ts
  // file: index.ts
  import { Botist, MainScene, Telegram } from 'botist';
  import { Middleware } from './middleware';

  class Main extends MainScene {
    public subscribe() {
      this.text(/.*/, () => {
        // ...
      });
    }
  }

  const bot = new Botist({
      port: 5555,
      scene: Main,
  });

  bot.afterScene(new Middleware(bot, Main));

  bot.adapter(new Telegram('token', 'webHookUrl'));
  ```

- Added option `labels: string[]` to the `text()` subscriber. It allows to mark subscribers an arbitrary set of labels to identify them from middlewares in the future.

- Added special context for text subscribers. Subscriber handler now calling with instance of `SubscriberContext` which includes two methods that allows to making a special logic in the middlewares:
  - `getSceneSubscribers(filter?: ISubscribersFilter): ISubscriber[]` returns the subscribers list of the current scene with possibility to filter them.
  - `match(subscriber: ISubscriber): boolean` returns the matching result of passed subscriber to the current scene with current message.

  Example of the scene with custom `command()` subscriber marked by label:

  ```ts
  import { Botist, MainScene, ISubscriberCallback, ITextMessage } from 'botist';

  class Main extends MainScene {
    public subscribe() {
      this.command(/.*/, () => {
        // ...
      });
    }

    private command(text: string, callback: ISubscriberCallback<ITextMessage>): void {
      this.text(text, callback, { labels: ['command'] });
    }
  }
  ```

  And example middleware which logic based on the `command` label of the scene subscribers:

  ```ts
  import { MessageMiddleware, ITextMessage, ISubscriber } from 'botist';

  export class Middleware extends MessageMiddleware {
    public subscribe(): void {
      this.text(/.*/, function(msg: ITextMessage) => {
        // Detect if a message is a command.
        const isCommand = this.getSceneSubscribers((subscriber: ISubscriber) => {
          return this.match(subscriber) && subscriber.options.labels.includes('command');
        }).length > 0;

        // ...
      });
    }
  }
  ```

## 0.6.0 (April 15, 2020)

### Added
- Scene methods `enter()` and `leave()` now take an `event: IEvent` as third argument. The `event` is instance of `Event` descendant class which reports about action that led to the handler, it can be:
  - `StartEvent` – when starts first scene of scenario
  - `BackEvent` – when `scene.back()` was called
  - `NextEvent` – when `scene.next()` was called
  - `ExitEvent` – when `scene.exit()` was called
  - `ExitTTLEvent` – when the scene was leaved by time to leave

  In addition it possible to pass custom event to the `back()`, `next()` or `exit()` methods, for example:
  ```ts
  // file: CustomScene.ts
  import { Scene, IEvent } from 'botist';
  export class CustomEvent implements IEvent {
    public readonly type = 'custom-event';
  }
  export default class CustomScene extends Scene {
    public subscribe(): void {
      this.text('/back', () => {
        this.back(new CustomEvent());
      });
    }
  }
  ```

  ```ts
  // file: MainScene.ts
  import { MainScene, IMessage, IResponse, IEvent } from 'botist';
  import { CustomEvent } from './CustomScene.ts';
  export class Main extends MainScene {
    public enter(msg: IMessage, res: IResponse, event: IEvent): void {
      super.enter(msg, res, event);
      if (event instanceof CustomEvent) {
        console.log(event); // CustomEvent { type: 'custom-event' }
      }
    }
  }
  ```

## 0.5.1 (January 14, 2020)

### Added
- Telegram/Adapter creates property `language` to the message when it available.

## 0.5.0 (December 9, 2019)

### Changed
- Scene methods `enter(msg: IMessage, res: Response)` and `leave(msg: IMessage, res: Response)` now take `msg` as first argument similarly as handler of `text()`.

## 0.4.0 (February 24, 2019)

### Added
- Created `adapter` property with name of adapter to the error object of `sendText()` and `sendMarkdown()` methods.
- To the constructor added option `catch`, it's function which can handle all errors to prevent unhandled rejections.

### Changed
- Methods `sendText()` and `sendMarkdown()` now throw error not as object, but as instance of `SendError`.

## 0.3.0 (February 3, 2019)

### Added
- To methods `sendText()` and `sendMarkdown()` added options, where can be used `disableWebPagePreview`.

### Changed
- Method `sendText()` now use default mode.
- Added method `sendMarkdown()` which use markdown mode.

## 0.2.2 (January 20, 2019)

### Added
- Exported types `IRequestResponse`, `IRequestSuccess`, `IRequestError`, `IMessage`, `ITextMessage`, `IImageMessage`.
- Telegram/Adapter `sendText()` use markdown parse mode.

## 0.2.1 (October 14, 2018)

### Added
- Added debug-messages on create adapter with webhook and request adapter webhook.
- Telegram/Adapter wraps parse of error of setting webhook.

## 0.2.0 (July 8, 2018)

### Added
- Support multiple users at one time. Now current users scenes are not affects each other.
- Scene methods `enter(res: Response)` and `leave(res: Response)` now takes parameter for possibility to reply.
- Added method `scenario(scenario: Scenario, next?: () => void)` to Response to respond a specific user.

### Changed
- Strict resolving string text of route.
- Now `sendText()` method do nothing and returns object with empty `messageId` when text is missing.

### Removed
- Removed method `scenario()` from Scene class.

## 0.1.1 (June 23, 2018)

### Added
- Added method `getAdapter(name: string): IAdapter | null` to `Botist` class.

  The new method allows to obtain specified adapter to send message through it. This feature useful when instance of Botist was created in other module. For example:
  ```ts
  // file: first.ts
  import { Botist, MainScene, Telegram } from 'botist';
  const bot = new Botist({
      port: 5555,
      scene: class Main extends MainScene {
          public subscribe() {}
      },
  });
  bot.adapter(new Telegram('token', 'webHookUrl'));
  export default bot;
  ```

  ```ts
  // file: second.ts
  import bot from './first';
  const telegram = bot.getAdapter('Telegram');
  if (telegram) {
      telegram.sendText('1234567890', 'message');
  }
  ```

## 0.1.0 (June 13, 2018)

### Added
- Added a base `Botist` realization.
- Added `MainScene` and `Scene` classes for inherit custom scenes.
- Added `Scenario` for creating list of scenes.
- Created adapters for Telegram and Messenger.
