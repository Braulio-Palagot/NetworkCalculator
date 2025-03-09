import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {ButtonComponent} from '../../theme/components/button/button.component';
import {NetworksFormComponent} from './components/networks-form/networks-form.component';
import {Network} from '../../shared/model/Network';
import {NetworksResultComponent} from './components/networks-result/networks-result.component';

@Component({
  selector: 'app-main-calculator',
  imports: [
    ButtonComponent,
    NgIf,
    NetworksFormComponent,
    NetworksResultComponent
  ],
  templateUrl: './main-calculator.component.html',
  styleUrl: './main-calculator.component.scss'
})
export class MainCalculatorComponent implements OnInit {
  protected networks: Network[] = [];

  protected showResult: boolean = false;
  protected mobile: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.mobile = window.innerWidth < 768;
    console.log(this.mobile);
  }

  protected updateNetworks(networks: Network[]): void {
    this.networks = networks;
  }
}
