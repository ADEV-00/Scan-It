import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableHighlight,
  Linking,
  Dimensions,
  Alert,
  TouchableOpacity
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setModalVisible(true);
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setData(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View>
      <BarCodeScanner
        ratio="18:9"
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFill, styles.cameraContainer]}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Scan It</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setScanned(false);
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View>
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "white",
                textAlign: "center"
              }}
            >
              Barcode/QR Scanned:
            </Text>
            <Text style={styles.scannedDescription}>{data}</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                Linking.canOpenURL(data)
                  .then(supported => {
                    if (!supported) {
                      return Linking.openURL(
                        "https://www.google.com/search?q=" + data
                      );
                    } else {
                      return Linking.openURL(data);
                    }
                  })
                  .catch(err => alert(err));
              }}
              style={[styles.customButton]}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 15,
                  textTransform: "uppercase"
                }}
              >
                Open
              </Text>
            </TouchableOpacity>
            {scanned && (
              <TouchableOpacity
                style={styles.blueButton}
                onPress={() => {
                  setScanned(false);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 15,
                    textTransform: "uppercase"
                  }}
                >
                  Press to scan again
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ backgroundColor: "#172A3A" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              color: "white",
              marginBottom: 10
            }}
            onPress={() => {
              Linking.openURL("https://github.com/ADEV-00");
            }}
          >
            Made by ADEV
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    alignItems: "center",
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    backgroundColor: "#172A3A"
  },
  titleContainer: {
    width: "100%",
    alignSelf: "center",
    marginTop: 30,
    padding: 10,
    zIndex: 5,
    marginTop: 65
  },
  title: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#32E875",

    letterSpacing: 4
  },
  modalContainer: {
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#172A3A",
    width: "100%"
  },
  customButton: {
    backgroundColor: "#32E875",
    width: "55%",
    alignSelf: "center",
    marginTop: 30,
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  },
  blueButton: {
    backgroundColor: "#4FDEFF",
    width: "55%",
    alignSelf: "center",
    marginTop: 30,
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  },
  scannedDescription: {
    width: "50%",
    textAlign: "center",
    alignSelf: "center",
    overflow: "hidden",
    color: "white",
    opacity: 0.2,
    marginTop: 15
  }
});
