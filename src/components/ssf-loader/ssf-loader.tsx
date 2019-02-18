import { Component } from '@stencil/core';
import { animationData } from './ssf-loader-data';
import lottie from 'lottie-web';

@Component({
  tag: 'ssf-loader',
  styleUrl: 'ssf-loader.scss',
  shadow: true
})
export class SSFLoader {
  private lottieContainer!: HTMLElement;

  componentDidLoad() {
    lottie.loadAnimation({
      container: this.lottieContainer,
      renderer: 'svg',
      loop: true,
      autplay: true,
      animationData: animationData
    });
  }

  render() {
    return (
      <div
        class="loader-container"
        ref={el => (this.lottieContainer = el as HTMLInputElement)}
      />
    );
  }
}
