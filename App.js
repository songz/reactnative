import * as React from "react";
import { Text, View, StyleSheet, Keyboard, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Camera } from "expo-camera";

let userToken;

const sendChallenge = (path, body) => {
  return fetch(`https://rn.songz.dev/${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());
};

// or any pure javascript modules available in npm
import { Card, TextInput, Button } from "react-native-paper";

const Page3 = () => {
  let webcam;
  const [hasPermission, setHasPermission] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const cameraStyle = {
    width: "100%",
    height: 500,
  };

  const takePicture = async () => {
    if (!webcam) return alert("no camera");

    const photo = await webcam.takePictureAsync({
      base64: true,
      quality: 0.2,
    });

    const resp = await sendChallenge("challenge3", { imageData: photo.base64 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Permission of camera is: {hasPermission ? "Granted" : "Rejected"}
      </Text>

      <Camera
        style={cameraStyle}
        type={Camera.Constants.Type.back}
        ref={(ref) => {
          webcam = ref;
        }}
      ></Camera>

      <Button mode="contained" style={styles.button} onPress={takePicture}>
        Take Picture
      </Button>
    </View>
  );
};

const Page2 = ({ setLoginToken }) => {
  const [message, setMessage] = React.useState("");
  const registerForPushNotifications = async () => {
    if (!Constants.isDevice) {
      return alert("Must use physical device for Push Notifications");
    }
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();

    const resp = await sendChallenge("challenge2", { token: token.data });
    setMessage(resp.message);

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  return (
    <View style={styles.center}>
      <Text>{message}</Text>
      <Button
        mode="text"
        style={styles.asideButton}
        onPress={() => {
          SecureStore.deleteItemAsync("jwttoken");
          setLoginToken("");
        }}
      >
        Logout
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={registerForPushNotifications}
      >
        Get Push Notification Token
      </Button>
    </View>
  );
};

const Page1 = ({ setLoginToken }) => {
  const [name, setName] = React.useState("");
  const sendName = async () => {
    const resp = await sendChallenge("challenge1", { username: name });
    if (!resp.token) {
      return alert(resp.message);
    }
    SecureStore.setItemAsync("jwttoken", resp.token);
    setLoginToken(resp.token);
    userToken = resp.token;
    Keyboard.dismiss();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Pick a username!</Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Button mode="contained" style={styles.button} onPress={() => sendName()}>
        Submit
      </Button>
    </View>
  );
};

export default function App() {
  const [jwttoken, setJwttoken] = React.useState("");
  React.useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync("jwttoken");
      setJwttoken(token);
      userToken = token;
    }
    getToken();
  }, []);
  if (jwttoken) {
    return <Page3 setLoginToken={setJwttoken} />;
  }
  return <Page1 setLoginToken={setJwttoken} />;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 20,
  },
  asideButton: {
    position: "absolute",
    bottom: 20,
    right: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
});
