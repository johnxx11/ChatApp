import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input} from "react-native-elements";
import { Entypo } from '@expo/vector-icons';
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("");
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Create Chat Room",
            
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
                    <Entypo name="chat" size={24} color="#2C6BED" />
                }
            />
            <Button onPress={createChat} title='Create New Chat Room' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
});

export default AddChatScreen;
