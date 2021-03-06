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

  private browserSupportsWebSockets: boolean = false;

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
    this.browserSupportsWebSockets =
      'WebSocket' in window || 'MozWebSocket' in window;
  }

  render() {
    let loginContainerClasses = 'flex-column flex-h-center flex-v-center';
    loginContainerClasses += this.showLoader ? ' hidden' : '';

    return (
      <div class="flex-column flex-h-center main-container">
        <div
          class={
            this.browserSupportsWebSockets
              ? 'hidden'
              : 'flex-column flex-h-center flex-v-center full-flex'
          }>
          <div class="broken-browser-container flex-column">
            <div class="broken-browser" />
            <div class="text-center flex-column flex-h-center">
              <h2>Oooops!</h2>{' '}
              <span>Det ser ut som at denne nettlesaren er for gamal</span>
            </div>
          </div>
        </div>
        <div
          class={
            this.browserSupportsWebSockets ? 'loader-container' : 'hidden'
          }>
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
                    checked={this.rememberMe}
                    onCheckboxChecked={ev => this.rememberMeChanged(ev)}>
                    Hugs meg
                  </ssf-checkbox>
                </div>
              </div>
              <div id="qr-login-button-container" class="flex-column">
                {this.devices.map(deviceItem => (
                  <div class="device-button-row flex-row">
                    <ssf-button
                      color="primary"
                      type="raised"
                      onClick={_ => this.onDeviceButtonClick(deviceItem)}>
                      {this.getDeviceLoginButtonCaption(deviceItem)}
                    </ssf-button>
                    <ssf-button
                      color="primary"
                      type="outline"
                      class="button-delete"
                      onClick={_ => this.onDeleteDeviceButtonClick(deviceItem)}>
                      <i class="ssf-recycle_bin_delete_garbage" />
                    </ssf-button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
