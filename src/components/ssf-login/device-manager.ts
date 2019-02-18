export class Device {
  pushToken: string;
  deviceName: string;
  userName: string;
}

const COOKIE_NAME = 'SSFDevices';

export class DeviceManager {
  public devices: Device[];

  constructor() {
    this.devices = JSON.parse(this.readCookie());
  }

  public add(device: Device) {
    if (
      !!device.pushToken &&
      !this.devices.find(deviceItem => {
        return (
          deviceItem.pushToken.toLowerCase() === device.pushToken.toLowerCase()
        );
      })
    ) {
      this.devices.push(device);
      this.writeCookie();
    }
  }

  public remove(device: Device) {
    if (!!device.pushToken) {
      this.devices = this.devices.filter(deviceItem => {
        return deviceItem.pushToken !== device.pushToken;
      });

      this.writeCookie();
    }
  }

  private writeCookie() {
    const value = JSON.stringify(this.devices);
    document.cookie = `${COOKIE_NAME}=${value}; path=/`;
  }

  private readCookie(): string {
    var nameEQ = `${COOKIE_NAME}=`;
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return '[]';
  }
}
