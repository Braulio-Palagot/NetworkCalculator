import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Network} from '../../../../shared/model/Network';
import {NgForOf, NgIf} from '@angular/common';

const NETWORK_CLASS_LIMITS = {
  C: 256,
  B: 65536,
  A: 16777216
} as const;

const CLASSES_ADDRESS_TEMPLATE = {
  C: '192.168.1.0',
  B: '172.16.0.0',
  A: '10.0.0.0'
}

const NETWORK_LIMITS_EXPONENT = {
  0: 1,
  1: 2,
  2: 4,
  3: 8,
  4: 16,
  5: 32,
  6: 64,
  7: 128,
  8: 256,
  9: 512,
  10: 1024,
  11: 2048,
  12: 4096,
  13: 8192,
  14: 16384,
  15: 32768,
  16: 65536,
  17: 131072,
  18: 262144,
  19: 524288,
  20: 1048576,
  21: 2097152,
  22: 4194304,
  23: 8388608,
  24: 16777216,
  25: 33554432,
  26: 67108864,
  27: 134217728,
  28: 268435456,
  29: 536870912,
  30: 1073741824,
  31: 2147483648,
  32: 4294967296
} as const;

@Component({
  selector: 'app-networks-result',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './networks-result.component.html',
  styleUrl: './networks-result.component.scss'
})
export class NetworksResultComponent implements OnInit {
  @Input() public showResult: boolean = false;
  @Input() public networks: Network[] = [];

  protected netClass: string = '';
  protected templateAddress: string = '';
  protected totalDevices: number = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showResult'] && changes['showResult'].currentValue) {
      this.calculate();
    }
  }

  protected calculate() {
    this.totalDevices = 0;

    this.networks = this.sortNetworks(this.networks);
    this.netClass = this.calculateClass(this.networks);
    for (const [className, address] of Object.entries(CLASSES_ADDRESS_TEMPLATE)) {
      if (this.netClass === className) this.templateAddress = address;
    }

    // forEach with the network and its index
    this.networks.forEach((network: Network, index: number) => {
      this.calculateVLSM(network, index);
    });
  }

  private calculateVLSM(network: Network, i: number): void {
    network = this.calculateMask(network);

    if (i === 0)
      network.netAddress = this.templateAddress;

    if (i > 0)
      network.netAddress = this.addOctetAddresses(this.networks[i - 1].netBroadcast.split('.').map(Number), 1).join('.');

    network.netFirst = this.addOctetAddresses(network.netAddress.split('.').map(Number), 1).join('.');
    if (!network.wan) {
      network.netGateway = this.addOctetAddresses(network.netAddress.split('.').map(Number), network.addressesProjection - 2).join('.');
      network.netLast = this.substractOctetAddresses(network.netGateway.split('.').map(Number), 1).join('.');
      network.netBroadcast = this.addOctetAddresses(network.netGateway.split('.').map(Number), 1).join('.');
    } else {
      network.netLast = this.addOctetAddresses(network.netAddress.split('.').map(Number), network.addressesProjection - 2).join('.');
      network.netBroadcast = this.addOctetAddresses(network.netLast.split('.').map(Number), network.addressesProjection - 1).join('.');
    }
  }

  private calculateMask(network: Network): Network {
    const mask = Math.floor(32 - Math.log2(network.addressesProjection));

    network.mask = mask;
    network.stringMask = this.maskToString(mask);

    return network;
  }

  private maskToString(mask: number): string {
    const octets = [0, 0, 0, 0];

    for (let i = 0; i < 4; i++) {
      if (mask >= 8) {
        octets[i] = 255;
        mask -= 8;
      } else {
        octets[i] = 256 - Math.pow(2, 8 - mask);
        mask = 0;
      }
    }

    return octets.join('.');
  }

  private sortNetworks(networks: Network[]): Network[] {
    return networks.sort((a, b) => b.size - a.size)
  }

  private calculateClass(networks: Network[]): string {
    networks.forEach((network: Network) => {
      network.addressesProjection = this.findProjection(network.size + 2);

      this.totalDevices += network.addressesProjection;
    });

    if (this.totalDevices <= 0) return 'No se puede calcular la clase de red';

    for (const [className, limit] of Object.entries(NETWORK_CLASS_LIMITS)) {
      if (this.totalDevices <= limit) return className;
    }

    return 'No se puede calcular la clase de red';
  }

  private findProjection(totalDevices: number): number {
    for (const [exponent, limit] of Object.entries(NETWORK_LIMITS_EXPONENT)) {
      console.log('Exponent:', exponent, 'Limit:', limit);
      if (totalDevices <= limit) return limit;
    }

    return 0;
  }

  private addOctetAddresses(octets: number[], sum: number): number[] {
    const binaryOctets = octets.map(octet => octet.toString(2).padStart(8, '0'));
    const binaryString = binaryOctets.join('');
    const binarySum = (parseInt(binaryString, 2) + sum).toString(2);
    const octetsSum = binarySum.match(/.{1,8}/g);

    if (!octetsSum)
      return octets.map(() => 0);
    else
      return octetsSum.map(octet => parseInt(octet, 2));
  }

  private substractOctetAddresses(octets: number[], substract: number): number[] {
    const binaryOctets = octets.map(octet => octet.toString(2).padStart(8, '0'));
    const binaryString = binaryOctets.join('');
    const binarySubstract = (parseInt(binaryString, 2) - substract).toString(2);
    const octetsSubstract = binarySubstract.match(/.{1,8}/g);

    if (!octetsSubstract)
      return octets.map(() => 0);
    else
      return octetsSubstract.map(octet => parseInt(octet, 2));
  }
}
