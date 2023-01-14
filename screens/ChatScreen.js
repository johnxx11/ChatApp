import React, { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Platform, Keyboard} from 'react-native';
import { Avatar } from 'react-native-elements';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { TextInput, ScrollView, TouchableWithoutFeedback } from 'react-native';
import firebase from "firebase/compat/app"
import { db, auth } from '../firebase';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
  
                    <Text style={{ color: "white", fontWeight: "800" }}>
                        {route.params.chatName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ left: -4 }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View
                    style={{
                        right: -4
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
                keyboardVerticalOffset={90}
            >
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <ScrollView contentContainerStyle={{paddingTop: 15}}>
                        {messages.map(({ id, data }) => 
                            data.email === auth.currentUser.email ? (
                                <View key={id} style={styles.receiver}>
                                    <Avatar
                                        position="absolute"
                                        containerStyle={{
                                            position:"absolute",
                                            right:-45
                                        }}
                                        right={-45} 
                                        source={{uri:data.photoURL}} 
                                        size={37}
                                    />
                                    <Text style={styles.receiverText}>{data.message}</Text>
                                </View>
                            ) : (
                                <View key={id} style={styles.sender}>
                                    <Avatar
                                        position="absolute"
                                        containerStyle={{
                                            position:"absolute",
                                            left:-45
                                        }}
                                        left={-45} 
                                        source={{uri:data.photoURL}} 
                                        size={37}
                                    />
                                    <Text style={styles.senderText}>{data.message}</Text>
                                </View>
                            )
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput 
                         value={input}
                         onChangeText={(text) => setInput(text)}
                         onSubmitEditing={sendMessage}
                         placeholder="Messages" 
                         style={styles.textInput}
                        />
                        <TouchableOpacity 
                            onPress={sendMessage} 
                            activeOpacity={0.5}
                        >
                            <Ionicons name="send" size={24} color={"#2B68E6"} />
                        </TouchableOpacity>
                    </View>
                </>
                </TouchableWithoutFeedback>
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
        width: "100%"
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: "black",
        borderRadius: 30
    },
    receiver: {
        padding: 10,
        backgroundColor: "#7BB32E",
        alignSelf: "flex-end",
        borderRadius: 10,
        marginRight: 55,
        marginBottom: 20,
        maxWidth: "65%",
        position: "relative"
    },
    sender: {
        padding: 10,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-start",
        borderRadius: 10,
        marginLeft: 55,
        marginBottom: 20,
        maxWidth: "65%",
        position: "relative"
    },
    senderText: {
        color: "black",
        fontWeight: "600",
    },
    receiverText: {
        color: "black",
        fontWeight: "600",
    },
});

export default ChatScreen;
