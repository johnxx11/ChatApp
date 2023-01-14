import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';



const CustomListItem = ({ id, chatName, enterChat }) => {
    return (
        <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800"}}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">            
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
};

const styles = StyleSheet.create({
});

export default CustomListItem;
