export interface Network {
  id?: number;
  name: string;
  size: number;
  wan: boolean;

  mask: number;
  stringMask: string;

  netAddress: string;
  netFirst: string;
  netLast: string;
  netGateway?: string;
  netBroadcast: string;

  addressesProjection: number;
}
