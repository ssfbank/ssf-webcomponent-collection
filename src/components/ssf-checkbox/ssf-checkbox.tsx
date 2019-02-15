import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'ssf-checkbox',
  styleUrl: 'ssf-checkbox.scss',
  shadow: true
})
export class SSFCheckbox {
  /**
   * Caption to show on the checkbox
   */
  @Prop() caption: string;

  render() {
    return  <label class="pure-material-checkbox">
              <input type="checkbox" />
              <span>{this.caption}</span>
            </label>
  }
}
