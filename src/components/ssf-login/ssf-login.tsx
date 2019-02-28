import { Component, Prop, State } from '@stencil/core';
import { WebClient } from './websocket-client';
import { Device, DeviceManager } from './device-manager';

@Component({
  tag: 'ssf-login',
  styleUrl: 'ssf-login.scss',
  shadow: true
})
export class SSFLogin {
  /**
   * URL for EVRY Login client
   */
  @Prop() evryLoginURL: string =
    'https://acc.ssfbank.no/online/api/idp_login/evry/start_auth';

  /**
   * The host to SSF Login Services
   */
  @Prop() ssfLoginServiceHost: string = 'localhost:8070';

  /**
   * Use secure connection
   */
  @Prop() useSecureConnection: boolean = false;

  @State() sessionId: string;
  @State() devices: Device[];
  @State() rememberMe: boolean;
  @State() showLoader: boolean = false;

  private webClient: WebClient;
  private deviceManager: DeviceManager;

  private isIE: boolean = false;

  private connectWebSocket() {
    this.webClient.connect(this.ssfLoginServiceHost);
  }

  private setSessionId(): void {
    (async () => {
      this.sessionId = await this.webClient.getSessionId();
      const credentials = await this.webClient.startListening(this.sessionId);
      if (this.rememberMe) {
        this.deviceManager.add({
          deviceName: (credentials as any).deviceName,
          pushToken: (credentials as any).pushToken,
          userName: (credentials as any).personName
        });
      }
      await this.webClient.login(credentials);
    })();
  }

  private getDeviceLoginButtonCaption(device: Device) {
    if (!device) {
      return '';
    }

    return `${device.userName} sin ${device.deviceName}`;
  }

  private onDeleteDeviceButtonClick(device: Device) {
    this.deviceManager.remove(device);
    this.devices = this.deviceManager.devices;
  }

  private onDeviceButtonClick(device: Device) {
    this.webClient.loginWithPushToken(device.pushToken, this.sessionId);
    this.showLoader = true;
  }

  private rememberMeChanged(customEvent: CustomEvent<boolean>) {
    this.rememberMe = customEvent.detail;
  }

  componentWillLoad() {
    this.webClient = new WebClient(this.useSecureConnection);
    this.deviceManager = new DeviceManager();
    this.devices = this.deviceManager.devices;
    this.connectWebSocket();
    this.setSessionId();
    this.isIE = false || !!(document as any).documentMode;
  }

  render() {
    let loginContainerClasses = 'flex-column flex-h-center flex-v-center';
    loginContainerClasses += this.showLoader ? ' hidden' : '';

    return (
      <div class="flex-column flex-v-center flex-row flex-h-center">
        <div class={this.isIE ? '' : 'hidden'}>
          <div class="flex-column">
            <div class="broken-ie flex-row flex-h-center flex-v-end">
              <span class="text-center">Dette vil sannsynlegvis gå gale!<br/>Prøv igjen med Chrome</span>
            </div>
          </div>
        </div>
        <div class={this.isIE ? 'hidden' : ''}>
          <div class="loader-container">
            <ssf-loader
              class={
                this.showLoader
                  ? 'loader-inner-container'
                  : 'loader-inner-container hidden'
              }
            />
            <div class={loginContainerClasses}>
              <div class="flex-row flex-h-center">
                <iframe
                  id="evry-login-client"
                  src={this.evryLoginURL}
                  sandbox="allow-scripts allow-forms allow-popups allow-pointer-lock allow-same-origin allow-top-navigation"
                />
              </div>
              <div class="flex-row flex-h-center">
                <div class="flex-column flex-h-center">
                  <ssf-qr-code size={200} text={`ssfbank:${this.sessionId}`} />
                  <div class="remember-me-container">
                    <ssf-checkbox
                      caption="Hugs meg"
                      checked={this.rememberMe}
                      onCheckboxChecked={ev => this.rememberMeChanged(ev)}
                    />
                  </div>
                </div>
                <div id="qr-login-button-container" class="flex-column">
                  {this.devices.map(deviceItem => (
                    <div class="device-button-row flex-row">
                      <ssf-button
                        onClick={_ => this.onDeviceButtonClick(deviceItem)}
                        caption={this.getDeviceLoginButtonCaption(deviceItem)}
                      />
                      <ssf-button
                        class="button-delete"
                        onClick={_ => this.onDeleteDeviceButtonClick(deviceItem)}
                        caption=""
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
