import { Message, RKPlugin, Server } from '@remote-kakao/core';
import { ApiClient, KakaoLinkClient } from 'node-kakaolink';

declare module '@remote-kakao/core' {
  export class Message {
    replyKakaoLink(
      template: {
        id: number;
        args?: Record<string, any>;
      },
      room?: string
    ): Promise<unknown>;
  }
}

class KakaoLinkPlugin extends RKPlugin {
  private kakaoLink?: KakaoLinkClient;
  options:
    | { email: string; password: string; key: string; host: string }
    | undefined;
  private useKakaoLink = false;

  constructor(server: Server, options?: Record<string, any>) {
    super(server, options);
  }

  extendMessageClass = (msg: Message) => {
    if (this.useKakaoLink) {
      msg.replyKakaoLink = async (
        template: { id: number; args?: Record<string, any> },
        room: string = msg.room
      ) => {
        return new Promise((res, rej) => {
          this.kakaoLink!.sendLink(
            room,
            {
              link_ver: '4.0',
              template_id: template.id,
              template_args: template.args ?? {},
            },
            'custom'
          )
            .then(res)
            .catch(rej);
        });
      };
    }
    return msg;
  };

  onReady = async () => {
    if (!this.options) return;
    this.useKakaoLink = true;

    this.kakaoLink = new KakaoLinkClient();

    if (this.kakaoLink && this.options) {
      const api = await ApiClient.create(this.options.key, this.options.host);
      const loginRes = await api.login({
        email: this.options.email,
        password: this.options.password,
        keeplogin: true,
      });
      if (!loginRes.success)
        throw new Error('Failed login to KakaoLink server!');

      this.kakaoLink.login(loginRes.result);
    }
  };
}

export default KakaoLinkPlugin;
