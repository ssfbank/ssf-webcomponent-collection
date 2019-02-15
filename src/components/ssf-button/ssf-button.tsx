import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'ssf-button',
  styleUrl: 'ssf-button.scss',
  shadow: true
})
export class SSFButton {
  /**
   * Caption to show on the button
   */
  @Prop() caption: string;

  render() {
    return  <button class="pure-material-button-contained">{this.caption}</button>
  }
}
