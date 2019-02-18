import { Component, Prop, Event } from '@stencil/core';
import { EventEmitter } from '@stencil/core/dist/declarations';

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
  @Prop() checked: boolean;

  @Event() checkboxChecked: EventEmitter<boolean>;

  private checkboxInput!: HTMLInputElement;

  private checkboxChange() {
    this.checkboxChecked.emit(this.checkboxInput.checked);
  }

  render() {
    return (
      <label class="pure-material-checkbox">
        <input
          type="checkbox"
          checked={this.checked}
          ref={el => (this.checkboxInput = el as HTMLInputElement)}
          onChange={_ => this.checkboxChange()}
        />
        <span>{this.caption}</span>
      </label>
    );
  }
}
