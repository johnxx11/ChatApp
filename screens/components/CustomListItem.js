import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { db } from '../../firebase';

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

const CustomListItem = ({ id, chatName, enterChat }) => {
    const [chatMessages, setChatMessages] = useState([]);
    
    useEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setChatMessages(snapshot.docs.map((doc) => doc.data()))
            );
        return unsubscribe;
    });

    return (
        <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider style={styles.container}>
            <Avatar
                size={40}
                source={{uri: chatMessages?.[0]?.photoURL || 
                "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/nesuuhyyzmjip7zg0kg4"}}
                avatarStyle={{borderRadius: 5 }}
            />
            <ListItem.Content>
                <ListItem.Title style={styles.chatName} numberOfLines={1} ellipsizeMode="tail">
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">   
                    {(chatMessages[0]) ? (chatMessages[0].displayName + ": " + chatMessages[0].message) : ('')}  
                </ListItem.Subtitle>
            </ListItem.Content>
            <Text style={styles.time}>{chatMessages?.[0]?.timestamp?.toDate()?.getFullMinutes()}</Text>
        </ListItem>
    );
};

const styles = StyleSheet.create({
    chatName: {
        fontWeight: "800",
        flexDirection: "row",
        color: "#191970",
        fontSize: 16,
        alignSelf: "flex-start",
        right: 8,
        bottom: 3,
    },
    lastMessage: {
        color: "grey",
        fontWeight: "600",
        flexDirection: "row",
        alignSelf: "flex-start",
        right: 8,
        fontSize: "15",
    },
    time: {
        alignSelf: "flex-end",
        color: "grey",
        fontWeight: "600",
        fontSize: "15",
        alignSelf: "flex-end",
    }
});

export default CustomListItem;
