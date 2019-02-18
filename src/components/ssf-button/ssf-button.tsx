import { Component, Prop, Event } from '@stencil/core';
import { EventEmitter } from 'events';

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

  @Event() onClick: EventEmitter;

  render() {
    return (
      <button
        onClick={_ => this.onClick.emit('')}
        class="pure-material-button-contained">
        {this.caption}
      </button>
    );
  }
}
