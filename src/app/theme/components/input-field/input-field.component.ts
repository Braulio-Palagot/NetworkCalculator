import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'input-field',
  imports: [
    NgClass,
    NgIf,
    FormsModule
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss'
})
export class InputFieldComponent implements OnInit, OnChanges {
  protected hasError: boolean = false;
  protected isSuccess: boolean = false;
  protected isFocused: boolean = false;
  protected showPassword: boolean = false;

  @Input({transform: booleanAttribute}) protected filled: boolean = false;
  @Input({transform: booleanAttribute}) protected outlined: boolean = false;

  @Input({transform: booleanAttribute}) protected disabled: boolean = false;
  @Input({transform: booleanAttribute}) protected readonly: boolean = false;
  @Input({transform: booleanAttribute}) protected clear: boolean = false;

  @Input() public leadingIcon: string = '';
  @Input() public label: string = '';
  @Input() public fieldName: string = '';
  @Input() public type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() public placeholder: string = '';
  @Input() public value: string = '';
  @Input({transform: booleanAttribute}) public required: boolean = false;
  @Input() public pattern: string = '';

  @Input() public formSubmitted: boolean = false;
  @Input() public showSuccess: boolean = false;
  @Input() public errorMessage: string = '';

  @Output() protected valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
    if (!this.filled && !this.outlined) {
      this.filled = true;
    } else if (this.filled && this.outlined) {
      this.outlined = false;
    }

    if (this.type === 'password' && this.clear) {
      this.clear = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formSubmitted'] && changes['formSubmitted'].currentValue) {
      this.validateField();
    }
  }

  onFocus(event: FocusEvent) {
    this.isFocused = true;

  }

  onBlur(event: FocusEvent) {
    this.isFocused = false;
  }

  onChange(event: Event) {
    this.hasError = false;
    this.isSuccess = false;
    this.valueChange.emit(this.value);
  }

  togglePassword(show: boolean) {
    this.showPassword = show;
    document.getElementsByName(this.fieldName)[0].setAttribute('type', show ? 'text' : 'password');
  }

  clearInput() {
    this.value = '';
    this.valueChange.emit(this.value);
  }

  private validateField() {
    this.isFocused = false;

    if (this.required && this.value === '') {
      this.hasError = true;
    } else if (this.pattern !== '' && !new RegExp(this.pattern).test(this.value)) {
      this.hasError = true;
    } else {
      this.hasError = false;
      this.isSuccess = true;
    }
  }
}
