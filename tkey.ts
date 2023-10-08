import TorusStorageLayer from "@oraichain/storage-layer-torus";
import TorusServiceProvider from "@oraichain/service-provider-torus";
import { metadataUrl, Network } from "@oraichain/customauth";
import OnlySocialKey from "@oraichain/only-social-key";

const network: Network = (process.env.NODE_ENV as any) || "development";
const hostUrl = metadataUrl[network];
console.log(process.env.REACT_APP_NODE_ENV);

// Configuration of Service Provider
const customAuthArgs = {
  baseUrl: "",
  network, // based on the verifier network.
};
// Configuration of Modules
const storageLayer = new TorusStorageLayer({
  hostUrl,
});

const serviceProvider = new TorusServiceProvider({
  customAuthArgs,
  blsDkgPackage: {
    sign: (): Uint8Array | undefined => {
      return undefined;
    },
  },
});

export const OnlySocialLoginKey = new OnlySocialKey({
  serviceProvider,
  storageLayer,
});
