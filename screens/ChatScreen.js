import React, { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Platform, Keyboard, } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { TextInput, ScrollView } from 'react-native';
import firebase from "firebase/compat/app"
import { db, auth } from '../firebase';

let timeNow = new Date();

Date.prototype.getFullMinutes = function () {
    if (this.getDate() < timeNow.getDate() || 
        (this.getDate() >= timeNow.getDate() && this.getMonth() < timeNow.getMonth()) ||
        (this.getDate() >= timeNow.getDate() && this.getMonth() >= timeNow.getMonth() && this.getFullYear() < timeNow.getFullYear())) {
        return (this.getMonth() + 1) + "/" + this.getDate();
    }
    if (this.getMinutes() < 10) {
        return this.getHours()+ ":0" + this.getMinutes();
    }
    return this.getHours() + ":" + this.getMinutes();
 };

const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: "#191970" },
            headerTitleAlign: "left",

            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
  
                    <Text style={{ color: "white", fontWeight: "800", fontSize: 18}}>
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ left: -3 }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View
                    style={{
                        right: -3
                    }}
                >
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
            )
        });
    },[navigation, messages]);

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        });

        setInput("");
    };

    useLayoutEffect(() => {
        const unsubscribe = db
        .collection('chats')
        .doc(route.params.id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => 
            setMessages(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        );
        
        return unsubscribe;
    }, [route]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={"light"} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.chatContainer}
                keyboardVerticalOffset={85}
            >
                    <ScrollView
                        contentContainerStyle={{paddingTop: 25}}>
                        {messages.map(({ id, data }) => 
                            data.email === auth.currentUser.email ? (
                                <View key={id} style={styles.receiver}>
                                    
                                    <Avatar
                                        position="absolute"
                                        containerStyle={{
                                            position:"absolute",
                                            right:-50,
                                        }}
                                        right={-50} 
                                        source={{uri:data.photoURL}} 
                                        size={42}
                                        avatarStyle={{borderRadius: 5}}
                                    />
                                    <AntDesign style={styles.chatIcon} name="caretright" size={8} />
                                    <Text style={styles.receiverText}>{data.message}</Text>
                                    <Text style={styles.receiverTime}>
                                        {(data.timestamp)? (data.timestamp.toDate().getFullMinutes()) : ("")}
                                    </Text>
                                    
                                </View>
                            ) : (
                                <View key={id} style={styles.sender}>
                                    <Avatar
                                        position="absolute"
                                        containerStyle={{
                                            position:"absolute",
                                            left:-50,            
                                        }}
                                        left={-50} 
                                        source={{uri:data.photoURL}} 
                                        size={42}
                                        avatarStyle={{borderRadius: 5}}
                                    />
                                    <AntDesign style={styles.chatIcon2} name="caretleft" size={8} color="black" />
                                    <Text style={styles.senderName}>{data.displayName}</Text>
                                    
                                    <Text style={styles.senderText}>{data.message}</Text>
                                    <Text style={styles.senderTime}>
                                        {(data.timestamp)? (data.timestamp.toDate().getFullMinutes()) : ("")}
                                    </Text>
                                </View>
                            )
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput 
                         value={input}
                         onChangeText={(text) => setInput(text)}
                         onSubmitEditing={sendMessage}
                         placeholder="Let's chat!" 
                         style={styles.textInput}
                        />
                        <TouchableOpacity 
                            onPress={sendMessage} 
                            activeOpacity={0.5}
                            disabled={!input || input.trim() === ""}
                        >
                            <Ionicons 
                                name="send" size={24} 
                                color={(!input || input.trim() === "")? "grey" : "#191970"} />
                        </TouchableOpacity>
                    </View> 
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    chatContainer: {
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        width: "99%"
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "black",
        borderRadius: 15,
        fontSize: 15,
        fontWeight: "600"
    },
    receiver: {
        padding: 5,
        backgroundColor: "#7bb32e",
        alignSelf: "flex-end",
        borderRadius: 5,
        marginRight: 60,
        marginBottom: 16,
        maxWidth: "65%",
        position: "relative"
    },
    sender: {
        padding: 5,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-start",
        borderRadius: 5,
        marginLeft: 60,
        marginBottom: 20,
        maxWidth: "65%",
        position: "relative"
    },
    senderText: {
        color: "black",
        fontWeight: "600",
        bottom: 8,
        marginBottom: -3,
        fontSize: 13
        
    },
    senderName: {
        fontWeight: "800",
        fontSize: "14",
        bottom: 9,
        color: "#191970"
    },
    receiverText: {
        color: "black",
        fontWeight: "600",
        bottom: 8,
        marginBottom: -3,
        fontSize: 13
    },
    senderTime: {
        color: "#696969",
        fontWeight: "600",
        fontSize: "10",
        alignSelf: "flex-end",
        bottom: -1,
    },
    receiverTime : {
        color: "#696969",
        fontWeight: "600",
        fontSize: "10",
        alignSelf: "flex-end",
        bottom: -3
    },
    chatIcon: {
        alignSelf: "flex-end",
        left: 10,
        bottom: -10,
        color: "#7bb32e"
    },
    chatIcon2: {
        alignSelf: "flex-start",
        right: 10,
        bottom: -12,
        color: "#ECECEC"
    }
});

export default ChatScreen;
