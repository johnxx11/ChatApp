import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { Entypo } from '@expo/vector-icons';
import { auth } from "../firebase";



const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "ChatApp"
        })
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace("Home");
            }
        });
    
        return unsubscribe;
    }, []);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error));
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style="light" />
            <Entypo name="chat" size={150} color="#2C6BED" />
            <View style={styles.inputContainer}>
                <Input 
                    placeholder="Email" 
                    autoFocus 
                    type="email" 
                    value={email} 
                    onChangeText={(text) => setEmail(text)}
                />
                <Input 
                    placeholder="Password" 
                    secureTextEntry 
                    type="password"
                    value={password} 
                    onChangeText={(text) => setPassword(text)}
                    onSubmitEditing={signIn}
                />
            </View>
            <Button containerStyle={styles.button} onPress={signIn} title="Login" />
            <Button onPress={() => navigation.navigate('Register')} containerStyle={styles.button} 
            type="outline" title="Register" />
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    inputContainer:{
        width: 300
    },

    button: {
        width: 180,
        maginTop: 10,
        padding: 5,
    },

    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
