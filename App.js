import * as React from "react";
import { Text, View, StyleSheet, Keyboard, Platform } from "react-native";
//import * as Notifications from "expo-notifications";
//import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
//import * as SecureStore from "expo-secure-store";
//import { Camera } from "expo-camera";
import { Card, TextInput, Button } from "react-native-paper";

const Page1 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Pick a username!</Text>
      <TextInput label="Name" value={""} onChangeText={() => {}} />
      <Button mode="contained" style={styles.button} onPress={() => {}}>
        Submit
      </Button>
    </View>
  );
};

export default function App() {
  return <Page1 />;
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
