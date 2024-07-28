import React, { useEffect, useState } from "react";
import 'react-native-gesture-handler';
import { View, Text, Alert, Platform, PermissionsAndroid,Button } from "react-native";
import { BleManager } from "react-native-ble-plx";

// manifiest 에 권한 추가 하는 것은 공식 문서에 나와있습니다!!
//https://github.com/dotintent/react-native-ble-plx 밑에 android 부분에 있습니다!

function App() {

  const manager = new BleManager();

  const [scanning,setScanning]= useState(false)
  
  function myBleScanListenner(erro,device){
    console.log(`Device Found! : ${device.id} - ${device.name}`)
  }
  
  // 블루투스 켜졌는지 확인
  const isBluetoothEnabled = async () => {
    const state = await manager.state();
    return state === "PoweredOn";
  };

  // 장치 스캔
  const scanDevices= async () => {

    if(scanning=== false){
      setScanning(true)
      Alert.alert("Scanning devices!!!");
      manager.startDeviceScan(null,null,myBleScanListenner);
    }
    
    else{
      manager.stopDeviceScan()
      Alert.alert("Scan terminated!");
      setScanning(false)
    }
   
  }

  // 안드로이드 권한 확인
  const requiredAndroidPermissions = async () => {
    console.log("checking for Permissions!");

    if (Platform.OS === 'ios') {
      return true;
    }

    const apiLevel = parseInt(Platform.Version.toString(), 10);

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);

      return (
        result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
  };

  useEffect(() => {
    

    async function startUp() {
      try {
        const permissionOk = await requiredAndroidPermissions();
        console.log(`Permission result: ${permissionOk}`);

        const state = await isBluetoothEnabled();

      if(state === false)
        {
        Alert.alert("Please turn on the Bluetooth")
        }
     
      } 
      catch (err) {
        
          console.log(`Error on permission request: ${err}`);
        
      }
    }

    startUp();

   

  }, []);

  return (
    <View>
      <Text>Bluetooth APP</Text>
      <Button title={scanning=== true ? 'Stop Scanning': 'Start Scanning'} onPress={scanDevices}></Button>
    </View>
  );
}

export default App;
