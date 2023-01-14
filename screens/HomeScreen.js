import React, { useEffect, useLayoutEffect, useState }from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { Avatar } from 'react-native-elements';
import CustomListItem from './components/CustomListItem';
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebase";

const HomeScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace("Login")
        });
    };

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        ));
        return unsubscribe;
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerStyle: { backgroundColor: "#2C6BED" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
            headerBackVisible: false,
            
            headerLeft: () => (
                <View style={{ 
                    left: -2, 
                    bottom: 3,                    
                    flexDirection: "row",
                    width: 75,
                    justifyContent: "space-between", 
                }}>
                    <Avatar rounded source={{ uri: auth?.currentUser?.photoURL}}/>
                    <Text style={styles.userName}>{auth?.currentUser?.displayName}</Text>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    left: 5,
                    bottom: 3,   
                    flexDirection: "row",
                    width: 70,
                    justifyContent: "space-between",
                    
                }}>
                    <TouchableOpacity>
                        <Entypo onPress={() => navigation.navigate("AddChat")} name="new-message" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
                        <FontAwesome name="sign-out" size={27} color="#FFF"/>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id: id,
            chatName: chatName,
        });
    };

    return (
      <SafeAreaView>
        <StatusBar style="light" />
        <ScrollView style={styles.container}>
            {chats.map(({id, data: { chatName }}) => (
                <CustomListItem 
                    key={id} 
                    id={id} 
                    chatName={chatName} 
                    enterChat={enterChat}
                />
            ))}
        </ScrollView>
      </SafeAreaView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    userName: {
        color: "white",
        fontWeight: "600",
    }
});
