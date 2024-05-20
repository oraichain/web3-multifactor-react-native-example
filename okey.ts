import OnlySocialKey from '@oraichain/only-social-key';
import OraiServiceProvider from '@oraichain/service-provider-orai';
import OraiStorageLayer from '@oraichain/storage-layer-orai';
import { CustomAuthArgs, metadataUrl, Network } from '@oraichain/customauth';
import Multifactors from '@oraichain/multifactors.js';

const isProduction = false;

const network_v1 = isProduction ? Network.MAINNET : Network.STAGING;

const endpoint_v1 = metadataUrl[network_v1];

const multifactors: Multifactors = new Multifactors({});
const customAuthArgs: CustomAuthArgs = {
  baseUrl: 'http://localhost/serviceworker',
  network: network_v1,
  multifactors
};
export const OnlySocialLoginKeyV1 = new OnlySocialKey({
  serviceProvider: new OraiServiceProvider({
    customAuthArgs
  }),
  storageLayer: new OraiStorageLayer({
    hostUrl: endpoint_v1
  })
});

global.onlySocialKey = OnlySocialLoginKeyV1;
