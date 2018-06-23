## 0.1.1 (June 23, 2018)
- Add method `getAdapter(name: string): IAdapter | null` to `Botist` class.

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
- Add a base `Botist` realization.
- Add `MainScene` and `Scene` classes for inherit custom scenes.
- Add `Scenario` for creating list of scenes.
- Create adapters for Telegram and Messenger.
