import {
  booleanAttribute,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'select-field',
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    FormsModule
  ],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss'
})
export class SelectFieldComponent implements OnInit {
  @ViewChild('dropDownToggle') dropDownToggle: ElementRef | undefined;
  @ViewChild('selectList') selectList: ElementRef | undefined;

  protected hasError: boolean = false;
  protected isSuccess: boolean = false;
  protected isFocused: boolean = false;
  protected showSelect: boolean = false

  @Input({transform: booleanAttribute}) protected filled: boolean = false;
  @Input({transform: booleanAttribute}) protected outlined: boolean = false;

  @Input({transform: booleanAttribute}) protected disabled: boolean = false;
  @Input({transform: booleanAttribute}) protected readonly: boolean = false;

  @Input() public leadingIcon: string = '';
  @Input() public label: string = '';
  @Input() public fieldName: string = '';
  @Input() public placeholder: string = '';
  @Input({transform: booleanAttribute}) public required: boolean = false;

  @Input() public value: string = '';
  @Input() public options: { value: any, label: string }[] = [
    {value: '1', label: 'Option 1'},
    {value: '2', label: 'Option 2'},
    {value: '3', label: 'Option 3'},
    {value: '4', label: 'Option 4'},
    {value: '5', label: 'Option 5'},
    {value: '6', label: 'Option 6'},
    {value: '7', label: 'Option 7'},
    {value: '8', label: 'Option 8'},
    {value: '9', label: 'Option 9'},
    {value: '10', label: 'Option 10'},
  ];
  private optionsBackup: { value: string, label: string }[] = [];

  @Input() public formSubmitted: boolean = false;
  @Input() public showSuccess: boolean = false;
  @Input() public errorMessage: string = '';

  @Output() protected selection: EventEmitter<{ value: any, label: string }> = new EventEmitter<{
    value: string,
    label: string
  }>();

  constructor() {
  }

  ngOnInit() {
    if (!this.filled && !this.outlined) {
      this.filled = true;
    } else if (this.filled && this.outlined) {
      this.outlined = false;
    }

    this.optionsBackup = this.options;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formSubmitted'] && changes['formSubmitted'].currentValue) {
      this.validateField();
    }
  }

  onFocus(event: FocusEvent) {
    this.isFocused = true;
    this.toggleSelect(true);
  }

  onBlur(event: FocusEvent) {
    this.isFocused = false;
    this.toggleSelect(false);
  }

  onChange(event: Event) {
    this.hasError = false;
    this.isSuccess = false;

    if (this.value === '') {
      this.options = this.optionsBackup;
    } else {
      this.options = this.optionsBackup.filter(option => option.label.toLowerCase().includes(this.value.toLowerCase()));
    }
  }

  selectOption(option: { value: string, label: string }) {
    this.value = option.label;
    this.selection.emit(option);
    this.toggleSelect(false);
  }

  toggleSelect(show: boolean) {
    this.showSelect = show;
    this.dropDownToggle?.nativeElement.classList.toggle('rotate', show);

    setTimeout(() => {
      if (!show) {
        if (this.selectList && this.selectList.nativeElement) {
          this.selectList.nativeElement.scrollTop = 0;
        }
      }
    }, 250);
  }

  private validateField() {
    this.isFocused = false;

    if (this.required && this.value === '') {
      this.hasError = true;
    } else {
      this.hasError = false;
      this.isSuccess = true;
    }
  }
}
