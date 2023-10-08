import { useState } from "react";
import React from "react";
import type { PropsWithChildren } from "react";

import {
  ThemeProvider,
  createTheme,
  Button,
  makeStyles,
  Text,
} from "@rneui/themed";
import { View, Platform } from "react-native";
import { Header } from "@rneui/base";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { OnlySocialLoginKey as onlySocialKey } from "./tkey";

import * as buffer from "buffer";
import WebView from "react-native-webview";
import html from "./asset/interpolate.html";

if (typeof Buffer === "undefined") {
  console.log(buffer.Buffer);
  global.Buffer = buffer.Buffer;
}
global.window.addEventListener = (x) => x;

GoogleSignin.configure({
  iosClientId: process.env.IOS_CLIENT_ID,
});

const theme = createTheme({
  mode: "dark",
  darkColors: {
    background: "#000000",
  },
  components: {
    Button: {
      raised: true,
    },
  },
});
const isAndroid = Platform.OS === "android";

const App = () => {
  const [loginResponse, setLoginResponse] = useState<any>(null);
  const [interpolateResult, setInterpolateResult] = useState<any>(null);
  const [viewObject, setViewObject] = useState<any>(null);

  const onLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfoData = await GoogleSignin.signIn();

      const { shares, sharesIndexes, userInfo, thresholdPublicKey } = await (
        onlySocialKey.serviceProvider as any
      ).triggerLoginMobile({
        typeOfLogin: "google",
        verifier: "ios-google",
        clientId: process.env.IOS_CLIENT_ID,
        idToken: userInfoData.idToken,
      });
      setLoginResponse({ shares, sharesIndexes, userInfo, thresholdPublicKey });
    } catch (error: any) {
      console.log({ error });
      console.log("LoginError");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header
          centerComponent={{
            text: "Web3-Multifactor",
            style: { color: "#fff", fontSize: 20 },
          }}
        />
        {!interpolateResult && (
          <Container>
            <Button
              color={"primary"}
              radius={"md"}
              title={"Login"}
              onPress={onLogin}
            />
            {loginResponse && (
              <WebView
                originWhitelist={["*"]}
                source={
                  isAndroid
                    ? { uri: "file:///android_asset/interpolate.html" }
                    : html
                }
                javaScriptEnabled={true}
                injectedJavaScript={`
          window.shares = '${JSON.stringify(
            loginResponse.shares
              .slice(0, 3)
              .map((share: any) => share.toString("hex"))
          )}';
          window.indexes = '${JSON.stringify(
            loginResponse.sharesIndexes
              .slice(0, 3)
              .map((index: any) => index.toString("hex"))
          )}';
        `}
                onMessage={async (event) => {
                  console.log(
                    "🚀 ~ file: index.tsx:37 ~ constRegisterIntroScreen:FunctionComponent=observer ~ event:",
                    event.nativeEvent.data
                  );
                  const { result, error } = JSON.parse(event.nativeEvent.data);
                  console.log("result onMessage", result);
                  if (error) {
                    setLoginResponse(null);
                    return console.log(
                      "🚀 ~ file: index.tsx:131 ~ error:",
                      error
                    );
                  }
                  setInterpolateResult(result);
                }}
              />
            )}
          </Container>
        )}
        {interpolateResult && (
          <Container>
            <Button
              onPress={() => setViewObject(interpolateResult.privKey)}
              title={"Private key"}
            />
            <Button
              title={"Address"}
              onPress={() => setViewObject(interpolateResult.pubKey)}
            />
            <Button
              title={"User info"}
              onPress={() => setViewObject(loginResponse.userInfo)}
            />
            <Text style={{ marginTop: 20 }}>{JSON.stringify(viewObject)}</Text>
          </Container>
        )}
      </Container>
    </ThemeProvider>
  );
};
type Props = {};

const useStyles = makeStyles((styleTheme, _props: Props) => ({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 50,
    justifyContent: "space-around",
    backgroundColor: styleTheme.colors.background,
  },
}));

const Container = ({ children }: PropsWithChildren<{}>) => {
  const styles = useStyles();
  return <View style={styles.container}>{children}</View>;
};

export default App;
