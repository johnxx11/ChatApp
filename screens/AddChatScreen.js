import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Input} from "react-native-elements";
import { Entypo, AntDesign } from '@expo/vector-icons';
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("");
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "New Chat Rooms",
            headerStyle: { backgroundColor: "#191970" },
            headerLeft: () => (
                <TouchableOpacity
                    style={{ left: -4 }}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const createChat = async () => {
        await db.collection('chats').add({
            chatName: input,
        }).then(() => {
            navigation.goBack();
        }).catch((error) => alert(error));
    };

    return (
        <View style={styles.container}>
            <Input
                placeholder="Chat Room Name" 
                value={input} 
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={createChat}
                leftIcon={
                    <Entypo name="chat" size={30} color="grey" />
                }
            />
            <Button onPress={createChat} title='Create' disabled={!input || input.trim() === ""}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "99%",
        alignSelf: "center",
    },
});

export default AddChatScreen;
