import React, { useEffect } from "react";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View, BackHandler, Alert } from "react-native";
import Home from "./screen/Home";
import Game from "./screen/Game";
import History from "./screen/History";
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        "Exit App",
        "Are you sure you want to exit?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "OK", onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={({ navigation }) => ({
            headerTitle: "Player's List",
            headerTitleStyle: {
              color: '#c2c2c2'
            },
            headerStyle: {
              backgroundColor: '#141414',
              color: '#fff'
            }
          })}
          name="Home"
          component={Home}
        />

        <Stack.Screen
          options={({ navigation }) => ({
            headerTitle: 'History',
            headerTitleStyle: {
              color: '#c2c2c2'
            },
            headerStyle: {
              backgroundColor: '#141414'
            },
            headerLeft: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Game')}>
                  <Icon name='chevron-back-outline' style={{ color: '#666666', fontSize: 24, fontWeight: '500', paddingRight: 10 }} />
                </TouchableOpacity>
              </View>
            )
          })}
          name="History"
          component={History}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="Game"
          component={Game}
        />
      </Stack.Navigator>
    </NavigationContainer >
  )
}

export default App;