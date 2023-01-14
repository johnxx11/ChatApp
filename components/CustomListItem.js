import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';

const CustomListItem = ({ id, chatName, enterChat }) => {
    return (
        <ListItem key={id} bottomDivider>
            <Avatar
             rounded
             source={{
                uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
             }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: "800"}}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    ABC
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
};

const styles = StyleSheet.create({
});

export default CustomListItem;
