import OnlySocialKey from "@oraichain/only-social-key";
import TorusServiceProvider from "@oraichain/service-provider-torus";
import TorusStorageLayer from "@oraichain/storage-layer-torus";
import { metadataUrl, Network } from "@oraichain/customauth";

const isProduction = true;

const network_v1 = isProduction ? Network.MAINNET : Network.STAGING;
const network_v2 = isProduction ? Network.PRODUCTION : Network.STAGING;

const endpoint_v1 = metadataUrl[network_v1];
const endpoint_v2 = metadataUrl[network_v2];

export const OnlySocialLoginKeyV1 = new OnlySocialKey({
  serviceProvider: new TorusServiceProvider({
    customAuthArgs: {
      baseUrl: "http://localhost/serviceworker",
      network: network_v1,
      metadataUrl: endpoint_v1,
    } as any,
  }),
  storageLayer: new TorusStorageLayer({
    hostUrl: endpoint_v1,
  }),
});

export const OnlySocialLoginKeyV2 = new OnlySocialKey({
  serviceProvider: new TorusServiceProvider({
    customAuthArgs: {
      baseUrl: "http://localhost/serviceworker",
      network: network_v2,
      metadataUrl: endpoint_v2,
    } as any,
  }),
  storageLayer: new TorusStorageLayer({
    hostUrl: endpoint_v2,
  }),
});
