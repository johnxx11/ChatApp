import React, { useLayoutEffect, useState }from 'react';
import { StyleSheet, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { Avatar, Button, Input } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { auth } from "../firebase";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "",
            headerStyle: { backgroundColor: "#191970" },
            headerLeft: () => (
                <TouchableOpacity
                    style={{ left: -4 }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>
            ),
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
  
                    <Text style={{ color: "white", fontWeight: "800", fontSize: 18}}>
                        Register
                    </Text>
                </View>
            )
        });
    }, [navigation]);

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl || "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/nesuuhyyzmjip7zg0kg4",
            })
        }).catch((error) => alert(error.message));
    }

    return (
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light" />
            <TouchableOpacity activeOpacity={0.5}>
            <Avatar 
                rounded 
                size={130}
                source={{ uri: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/nesuuhyyzmjip7zg0kg4"}}
                containerStyle={{marginBottom: 30, alignSelf:"center"}}
                avatarStyle={{}}
            />
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <Input 
                    placeholder='User Name' 
                    style={styles.textInput}
                    type='text' 
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <Input 
                    style={styles.textInput}
                    placeholder='Email' 
                    type='email' 
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <Input 
                    style={styles.textInput}
                    placeholder='Password' 
                    secureTextEntry
                    type='password' 
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Input 
                    style={styles.textInput}
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
                title="Continue" 
            />
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    button: {
        width: 160,
        marginBottom: 80,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        
    },
    inputContainer: {
        width: 280,
    },
    textInput: {
        flex: 1,
        backgroundColor: "#fff",
        color: "dimgrey",
        borderRadius: 5,
        fontSize: 16,
        fontWeight: "700",
        padding: 1,
        paddingTop: 10
    },
});