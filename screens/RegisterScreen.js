import React, { useLayoutEffect, useState }from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { Button, Input, Text } from "react-native-elements";
import { auth } from "../firebase";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to Login",
        });
    }, [navigation]);

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            })
        })
        .catch((error) => alert(error.message));
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <Text h3 style={{ marginBottom: 50 }}> 
                Create a ChatApp Account
            </Text>
            <View style={styles.inputContainer}>
                <Input 
                    placeholder='User Name' 
                    autoFocus 
                    type='text' 
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <Input 
                    placeholder='Email' 
                    type='email' 
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <Input 
                    placeholder='Password' 
                    secureTextEntry
                    type='password' 
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Input 
                    placeholder='Profile Picture URL (optional)' 
                    type='text' 
                    value={imageUrl}
                    onChangeText={text => setImageUrl(text)}
                    onSubmitEditing={register}
                />
            </View>

            <Button 
                containerStyle={styles.button}
                raised 
                onPress={register} 
                title="Register" 
            />
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    button: {
        width: 200,
        marginTop: 10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300,
    }
});