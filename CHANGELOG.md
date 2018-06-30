## [Unreleased]

### Added
- Support multiple users at one time. Now current users scenes are not affects each other.
- Scene methods `enter(res: Response)` and `leave(res: Response)` now takes parameter for possibility to reply.
- Added method `scenario(scenario: Scenario, next?: () => void)` to Response to respond a specific user.

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