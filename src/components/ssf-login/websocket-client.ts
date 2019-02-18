import { Client } from '@stomp/stompjs/esm5/client';

export class WebClient {
  private client: Client;
  private hostName: string;

  constructor(private useSecureConnection: boolean) {
    this.client = new Client({
      // debug: str => {
      //   console.log(`WS DEBUG: ${str}`);
      // },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      logRawCommunication: false
    });

    this.client.onStompError = function() {};
  }

  public async connect(hostName: string) {
    this.hostName = hostName;
    if (this.client.connected) {
      this.client.forceDisconnect;
    }

    const protocol = this.useSecureConnection ? 'wss://' : 'ws://';

    this.client.brokerURL = `${protocol}${hostName}/login`;
    this.client.activate();
  }

  public async startListening(sessionId: string) {
    return await new Promise((resolve, reject) => {
      const callback = message => {
        if (message.body) {
          var body = JSON.parse(message.body);

          resolve(body);
        } else {
          reject('Timed out');
        }
      };

      const that = this;

      this.client.onConnect = function() {
        that.client.subscribe(`/broker/${sessionId}`, callback);
      };
    });
  }

  public async login(credentials) {
    return await new Promise(() => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          document.open();
          document.write(xhr.responseText);
          document.close();
        }
      };

      const protocol = this.useSecureConnection ? 'https://' : 'http://';

      xhr.open(
        'POST',
        `${protocol}${this.hostName}/api/login/prod/credentials/submit`,
        true
      );
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(JSON.stringify(credentials));
    });
  }

  public async loginWithPushToken(pushToken: string, sessionId: string) {
    var xhr = new XMLHttpRequest();

    const protocol = this.useSecureConnection ? 'https://' : 'http://';

    xhr.open('POST', `${protocol}${this.hostName}/api/login/push`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(
      JSON.stringify({
        pushToken: pushToken,
        sessionId: sessionId
      })
    );
  }

  public async getSessionId() {
    return await new Promise<string>((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 202) {
          const sessionId = xhr.responseText;
          resolve(sessionId);
        }
      };

      xhr.onerror = function() {
        reject(`ERROR:`);
      };

      const protocol = this.useSecureConnection ? 'https://' : 'http://';

      xhr.open(
        'GET',
        `${protocol}${this.hostName}/api/login/prod/credentials/`,
        true
      );
      xhr.send();
    });
  }
}
