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
            headerStyle: { backgroundColor: "#191970" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
            headerBackVisible: false,
            
            headerLeft: () => (
                <View style={{ 
                    right: 3, 
                    bottom: 3,                    
                    flexDirection: "row",
                    width: 75,
                    justifyContent: "space-between", 
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Avatar 
                            rounded 
                            size={35}
                            source={{ uri: auth?.currentUser?.photoURL}}
                            avatarStyle={{
                                borderWidth: 2,
                                borderColor: '#fff'}}
                        />
                    </TouchableOpacity>
                    <Text style={styles.userName}>{auth?.currentUser?.displayName}</Text>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    left: 3,
                    bottom: 3,   
                    flexDirection: "row",
                    width: 70,
                    justifyContent: "space-between",
                    
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
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
        <ScrollView style={styles.container} >
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
        flexDirection: "row",
        color: "white",
        fontWeight: "600",
        fontSize: 20,
        alignSelf: "center",
        marginStart: 10,
        justifyContent: "center"
    }
});
