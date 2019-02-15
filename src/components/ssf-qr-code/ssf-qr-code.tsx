import { Component, Prop, Watch, State } from '@stencil/core';
import { toBoolean } from '../../utils/utils'
import AwesomeQRCode from './awesome-qr.js'
import imgLoaded from './imgLoaded'

@Component({
  tag: 'ssf-qr-code',
  styleUrl: 'ssf-qr-code.scss',
  shadow: true
})
export class SSFQrCode {
  @Prop()
  text: string;

  @Prop()
  qid: string;

  @Prop()
  size: number = 400;

  @Prop()
  margin: number = 0;

  @Prop()
  colorDark: string = '#00529b';

  @Prop()
  colorLight: string = '#90caf9';

  @Prop()
  bgSrc: string = 'assets/Crystal.png';

  @Prop()
  backgroundDimming: string = 'rgba(0, 0, 0, 0)';

  @Prop()
  logoSrc: string = 'assets/logo.png';

  @Prop()
  logoScale: number = 0.2;

  logoMargin: number = 5;
  @Prop()
  logoCornerRadius: number = 5;

  @Prop()
  whiteMargin: boolean = false;

  @Prop()
  dotScale: number = 0.2;

  @Prop()
  autoColor: boolean = false;

  @Prop()
  binarize: boolean = false;

  @Prop()
  binarizeThreshold: number = 128;

  @Prop()
  callback: Function;

  @State() src: string;

  @Watch('text')
  textWatchHandler() {
    this.main();
  }

  @Watch('logoSrc')
  logoSrcHandler() {
    this.main();
  }
  @Watch('bgSrc')
  bgSourceHandler() {
    this.main();
  }

  componentDidLoad() {
    this.main()
  }

  async main() {
    if (this.bgSrc && this.logoSrc) {
      const bgImg = await imgLoaded(this.bgSrc)
      const logoImg = await imgLoaded(this.logoSrc)
      this.generateQR(bgImg, logoImg)
      return
    }
    if (this.bgSrc) {
      const img = await imgLoaded(this.bgSrc)
      this.generateQR(img)
      return
    }
    if (this.logoSrc) {
      const img = await imgLoaded(this.logoSrc)
      this.generateQR(undefined, img)
      return
    }
  }

  private generateQR(image?, logoImage?) {
    const res = AwesomeQRCode.create({
      text: this.text,
      size: this.size,
      margin: this.margin,
      colorDark: this.colorDark,
      colorLight: this.colorLight,
      backgroundImage: image,
      backgroundDimming: this.backgroundDimming,
      logoImage: logoImage,
      logoScale: this.logoScale,
      logoMargin: this.logoMargin,
      logoCornerRadius: this.logoCornerRadius,
      whiteMargin: toBoolean(this.whiteMargin),
      dotScale: this.dotScale,
      autoColor: toBoolean(this.autoColor),
      binarize: toBoolean(this.binarize),
      binarizeThreshold: this.binarizeThreshold,
      callback: function(dataURI) {
        this.callback && this.callback(dataURI, this.qid)
      }
    });

    this.src = res;
  }

  render() {
    return <div><img src={this.src}></img></div>;
  }
}
