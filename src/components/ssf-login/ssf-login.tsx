import { Component, Prop, State } from '@stencil/core';
import { WebClient } from './websocket-client';

@Component({
  tag: 'ssf-login',
  styleUrl: 'ssf-login.scss',
  shadow: true
})
export class SSFLogin {
  /**
   * URL for EVRY Login client
   */
  @Prop() evryLoginURL: string = "https://acc.ssfbank.no/online/api/idp_login/evry/start_auth";

  /**
   * The host to SSF Login Services
   */
  @Prop() ssfLoginServiceHost: string = "localhost:8070";

  /**
   * Use secure connection
   */
  @Prop() useSecureConnection: boolean = false;

  @State() sessionId: string;

  private webClient: WebClient;

  private connectWebSocket() {
    this.webClient.connect(this.ssfLoginServiceHost);
  }

  private setSessionId(): void {
    (async () => {
      this.sessionId = await this.webClient.getSessionId();
      const credentials = await this.webClient.startListening(this.sessionId);
      await this.webClient.login(credentials);
    })();
  }

  componentWillLoad() {
    this.webClient = new WebClient(this.useSecureConnection);
    this.connectWebSocket();
    this.setSessionId();
  }

  render() {
    return  <div class="flex-column flex-h-center flex-v-center full-height">
              <div class="flex-row flex-h-center">
                <iframe
                  id="evry-login-client"
                  src={this.evryLoginURL}
                  sandbox="allow-scripts allow-forms allow-popups allow-pointer-lock allow-same-origin allow-top-navigation">
                </iframe>
              </div>
              <div class="flex-row flex-h-center">
                <div class="flex-column flex-h-center">
                  <ssf-qr-code size={200} text={`ssfbank:${this.sessionId}`}></ssf-qr-code>
                  <div class="remember-me-container">
                    <ssf-checkbox caption="Hugs meg"></ssf-checkbox>
                  </div>
                </div>
                <div
                    id="qr-login-button-container"
                    class="flex-column">
                    <ssf-button caption="TEST"></ssf-button>
                </div>
              </div>
            </div>
  }
}
