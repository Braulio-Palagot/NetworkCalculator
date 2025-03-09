import {booleanAttribute, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'input-button',
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnInit {
  @Input({transform: booleanAttribute}) public filled: boolean = false;
  @Input({transform: booleanAttribute}) public outlined: boolean = false;
  @Input({transform: booleanAttribute}) public text: boolean = false;

  @Input({transform: booleanAttribute}) public disabled: boolean = false;
  @Input({transform: booleanAttribute}) public primary: boolean = false;
  @Input({transform: booleanAttribute}) public secondary: boolean = false;

  @Input() public leadingIcon: string = '';
  @Input() public label: string = '';
  @Input() public trailingIcon: string = '';

  @Input() public type: 'button' | 'submit' | 'reset' = 'button';

  @Output() public onClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor() {
  }

  ngOnInit() {
    if (!this.filled && !this.outlined && !this.text) {
      this.filled = true;
    } else if (this.filled && this.outlined) {
      this.outlined = false;
    } else if (this.filled && this.text) {
      this.text = false;
    } else if (this.outlined && this.text) {
      this.text = false;
    }

    if (!this.primary && !this.secondary) {
      this.primary = true;
    } else if (this.primary && this.secondary) {
      this.secondary = false;
    }
  }

  public emitClick(event: MouseEvent) {
    this.onClick.emit(event);
  }
}
