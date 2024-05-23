import { useState } from 'react';
import React from 'react';
import type { PropsWithChildren } from 'react';

import { ThemeProvider, createTheme, Button, makeStyles, Text } from '@rneui/themed';
import { View, Platform, DimensionValue } from 'react-native';
import { Header } from '@rneui/base';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

// import * as buffer from "buffer";
import WebView from 'react-native-webview';
// @ts-ignore
import html from './asset/interpolate.html';
import OraiServiceProvider from '@oraichain/service-provider-orai';
import { LOGIN_TYPE } from '@oraichain/customauth';
console.log(process.env.ANDROID_CLIENT_ID);
GoogleSignin.configure({
  iosClientId: process.env.IOS_CLIENT_ID,
  webClientId: process.env.ANDROID_CLIENT_ID
});

const theme = createTheme({
  mode: 'dark',
  darkColors: {
    background: '#000000'
  },
  components: {
    Button: {
      raised: true
    }
  }
});
const isAndroid = Platform.OS === 'android';

const App = () => {
  const [loginResponse, setLoginResponse] = useState<any>(null);
  const [interpolateResult, setInterpolateResult] = useState<any>(null);
  const [viewObject, setViewObject] = useState<any>(null);

  const onLogin = async ({ typeOfLogin, verifier, clientId, idToken }: { typeOfLogin: LOGIN_TYPE; verifier: string; clientId: string; idToken: string }) => {
    try {
      const start = Date.now();
      console.log('triggerLoginMobile 1:', Date.now());
      const [v1Data] = await Promise.all([
        (onlySocialKey.serviceProvider as OraiServiceProvider).triggerLoginMobile({
          typeOfLogin,
          verifier,
          clientId,
          idToken
        })
      ]);
      console.log('triggerLoginMobile 2:', Date.now());
      console.log({ v1Data });

      setLoginResponse(v1Data);
    } catch (error: any) {
      console.log(error.message);
      console.log('LoginError');
    }
  };

  const onGoogleButton = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfoData = await GoogleSignin.signIn();
      if (userInfoData.idToken) {
        await onLogin({
          typeOfLogin: 'google',
          verifier: 'tkey-google-staging',
          clientId: process.env.ANDROID_CLIENT_ID,
          idToken: userInfoData.idToken
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  async function onAppleButtonPress() {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // Note: it appears putting FULL_NAME first is important, see issue #293
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      });
      console.log({ appleAuthRequestResponse });
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('authorize success');
      }
      if (appleAuthRequestResponse.identityToken) {
        await onLogin({
          typeOfLogin: 'jwt',
          verifier: 'ios-tkey-apple-2',
          clientId: 'com.tkey.dev',
          idToken: appleAuthRequestResponse.identityToken
        });
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header
          centerComponent={{
            text: 'Web3-Multifactor',
            style: { color: '#fff', fontSize: 20 }
          }}
        />
        {!interpolateResult && (
          <Container props={{ rowGap: 20 }}>
            <Button color={'primary'} radius={'md'} title={'Sign in with Google'} onPress={onGoogleButton} />
            <Button color={'primary'} radius={'md'} title={'Sign in with Apple'} onPress={onAppleButtonPress} />
            {loginResponse && (
              <WebView
                originWhitelist={['*']}
                source={isAndroid ? { uri: 'file:///android_asset/interpolate.html' } : html}
                javaScriptEnabled={true}
                injectedJavaScript={`
          window.shares = '${JSON.stringify(loginResponse.shares.slice(0, 3).map((share: any) => share.toString('hex')))}';
          window.indexes = '${JSON.stringify(loginResponse.sharesIndexes.slice(0, 3).map((index: any) => index.toString('hex')))}';
        `}
                onMessage={async (event) => {
                  console.log('🚀 ~ file: index.tsx:37 ~ constRegisterIntroScreen:FunctionComponent=observer ~ event:', event.nativeEvent.data);
                  const { result, error } = JSON.parse(event.nativeEvent.data);
                  console.log('result onMessage', result);
                  if (error) {
                    setLoginResponse(null);
                    return console.log('🚀 ~ file: index.tsx:131 ~ error:', error);
                  }
                  console.log('triggerLoginMobile 3:', Date.now());
                  setInterpolateResult(result);
                }}
              />
            )}
          </Container>
        )}
        {interpolateResult && (
          <Container props={{ flexBasis: 400, rowGap: 20, justifyContent: 'center' }}>
            <Button onPress={() => setViewObject(interpolateResult.privKey)} title={'Private key'} />
            <Button title={'Address'} onPress={() => setViewObject(interpolateResult.pubKey)} />
            <Button title={'User info'} onPress={() => setViewObject(loginResponse.userInfo)} />
            <Text style={{ marginTop: 20 }}>{JSON.stringify(viewObject)}</Text>
          </Container>
        )}
      </Container>
    </ThemeProvider>
  );
};
type Props = {
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: string;
  flexBasis?: DimensionValue;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  columnGap?: number;
  rowGap?: number;
};

const useStyles = makeStyles((styleTheme, props: Props) => ({
  container: {
    flexBasis: props.flexBasis ? props.flexBasis : 'auto',
    columnGap: props.columnGap ? props.columnGap : 0,
    rowGap: props.rowGap ? props.rowGap : 0,
    padding: 25,
    paddingTop: 50,
    backgroundColor: props.backgroundColor ? props.backgroundColor : styleTheme.colors.background,
    justifyContent: props.justifyContent ? props.justifyContent : 'flex-start',
    width: props.width ? props.width : '100%',
    height: props.height ? props.height : '100%'
  }
}));

const Container = ({ children, props }: PropsWithChildren<{ props?: Props }>) => {
  const styles = useStyles(props);
  return <View style={styles.container}>{children}</View>;
};

export default App;
