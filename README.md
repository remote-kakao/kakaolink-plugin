![remote](https://raw.githubusercontent.com/remote-kakao/core/main/images/banner.png)

# kakaolink-plugin

[Discord Server](https://discord.gg/T9PrmtcR8a)

## About

kakaolink-plugin is a remote-kakao plugin for sending [KakaoLinks](https://developers.kakao.com/product/message) instead of plain text.

## Requirements

- Node.js v17+
- `@remote-kakao/core` v1+

## Example

```ts
import { Server } from '@remote-kakao/core';
import KakaoLinkPlugin from '@remote-kakao/kakaolink-plugin';

const config = {
  email: 'email@kakao.com',
  password: 'p@ssw0rd',
  key: '00000000000000000000000000000000',
  host: 'https://example.com',
};

const prefix = '>';
const server = new Server();

server.usePlugin(KakaoLinkPlugin, config);

server.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(' ');
  const cmd = args.shift()?.slice(prefix.length);

  if (cmd === 'kakaolink') {
    msg.replyKakaoLink({
      id: 00000, // KakaoTalk Message Template id
      args: { arg1: args[0], arg2: args[1] }, // KakaoTalk Message Template arguments
    });
  }
});

server.start(3000);
```
