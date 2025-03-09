import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ButtonComponent} from '../../../../theme/components/button/button.component';
import {InputFieldComponent} from '../../../../theme/components/input-field/input-field.component';
import {NgForOf, NgIf} from '@angular/common';
import {SelectFieldComponent} from '../../../../theme/components/select-field/select-field.component';
import {Network} from '../../../../shared/model/Network';

@Component({
  selector: 'app-networks-form',
  imports: [
    ButtonComponent,
    InputFieldComponent,
    NgForOf,
    NgIf,
    SelectFieldComponent
  ],
  templateUrl: './networks-form.component.html',
  styleUrl: './networks-form.component.scss'
})
export class NetworksFormComponent implements OnInit {
  protected networks: Network[] = [];

  protected types: { value: any, label: string }[] = [
    {value: false, label: 'LAN'},
    {value: true, label: 'WAN'}
  ];

  @Output() nets: EventEmitter<Network[]> = new EventEmitter<Network[]>();

  constructor() {
  }

  ngOnInit(): void {
    this.networks.push({
      id: 1,
      name: '',
      size: 0,
      wan: false,
      mask: 0,
      stringMask: '',
      netAddress: '',
      netFirst: '',
      netLast: '',
      netGateway: '',
      netBroadcast: '',
      addressesProjection: 0
    });

    this.nets.emit(this.networks);
  }

  addNetwork(): void {
    this.networks.push({
      id: this.networks.length + 1,
      name: '',
      size: 0,
      wan: false,
      mask: 0,
      stringMask: '',
      netAddress: '',
      netFirst: '',
      netLast: '',
      netGateway: '',
      netBroadcast: '',
      addressesProjection: 0
    });

    this.nets.emit(this.networks);
  }

  removeNetwork(network: Network): void {
    if (this.networks.length > 1) {
      this.networks = this.networks.filter(n => n.id !== network.id);
      this.nets.emit(this.networks);
    }
  }

  handleChange<K extends keyof Network>(
    event: any,
    network: Network,
    field: K
  ): void {
    switch (field) {
      case 'size':
        network.size = Number(event);
        break;
      case 'wan':
        network.wan = Boolean(event);
        break;
      default:
        network[field] = event;
    }
  }
}
