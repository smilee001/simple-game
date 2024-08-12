import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import History from './History';

const Home = ({ navigation, route }) => {

    const [list, setList] = useState([
        {
            id: '0',
            UserName: 'UserName',
            Time: 'Time',
            Result: 'Result',
            History: []
        }
    ]);
    const [userName, setUserName] = useState('');
    const [createbox, setCreatebox] = useState(false);

    const storeData = async (data) => {
        try {
            await AsyncStorage.setItem('myList', JSON.stringify(data));
        } catch (e) {
            console.error(e);
        }
    };

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('myList');
            if (jsonValue !== null) {
                setList(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const focusListener = navigation.addListener('focus', () => {
            getData();
        });

        // Check if focusListener exists before removing it
        // if (focusListener) {
        //     return () => {
        //         focusListener.remove();
        //     };
        // }
    }, [navigation]);


    const okay = async () => {
        if (userName == '') {
            return alert('Please Enter Username');
        }

        // console.log(list.length);
        const newItem = {
            id: list.length,
            UserName: userName,
            Time: '00:00',
            Result: 'None',
            History: [
                {
                    MatchNo: 'Match No.',
                    Time: 'Time',
                    Result: 'Result'
                }
            ]
        };

        console.log(newItem);

        setList([...list, newItem]);
        await storeData([...list, newItem]);
        setUserName('');

        if (createbox == true) {
            setCreatebox(false);
        }

        // navigation.navigate('Game')
    }

    const createuser = () => {
        setCreatebox(true);
    }

    const close = () => {
        setCreatebox(!createbox)
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center' }}>

                {
                    list?.length === 0 || createbox ? (
                        <View style={{ width: '80%', position: 'absolute', zIndex: 10, top: '30%', backgroundColor: '#282928', padding: 20, gap: 30, borderRadius: 20 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                                <View style={{ backgroundColor: 'tomato', width: 25, height: 25, borderRadius: 50 }}></View>
                                <Text style={{ fontSize: 23, fontWeight: '500', color: '#c4c4c4' }}>Give Your Name</Text>
                            </View>

                            <TextInput style={{ fontSize: 20, borderBottomWidth: 1, borderColor: '#777777', paddingBottom: 5, paddingLeft: 0, color: '#c4c4c4' }} placeholder='Enter your name here' placeholderTextColor={'#777777'}
                                value={userName}
                                onChangeText={(text) => { setUserName(text) }}>
                            </TextInput>

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                {
                                    list?.length === 0 ? null : (
                                        <TouchableOpacity style={{ width: 100, backgroundColor: '#282928' }} onPress={close}>
                                            <Text style={{ fontSize: 20, color: 'tomato', textAlign: 'center' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    )
                                }
                                < TouchableOpacity style={{ width: 40, backgroundColor: '#282928' }} onPress={okay}>
                                    <Text style={{ fontSize: 20, color: 'tomato', textAlign: 'center' }}>Play</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null
                }

                <View style={{ width: '100%', flex: 1 }}>

                    {list?.length === 0 ? (
                        <View style={{ flex: 1, backgroundColor: '#141414', marginHorizontal: 15, marginBottom: 15, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 20, gap: 30 }}>
                            <Text style={{ fontSize: 20, fontWeight: '500', color: '#555555', marginLeft: 10 }}>No Any History, Play Games</Text>
                        </View>
                    ) : (
                        <ScrollView style={{ flex: 1, marginHorizontal: 15, borderRadius: 10, overflow: 'hidden' }}>
                            {
                                list.map((item, index) => {
                                    // { console.log(item) }
                                    return (
                                        <React.Fragment key={index}>
                                            {index === 0 ? (
                                                <View style={{ height: list?.length == 1 ? '100%' : null, borderRadius: 10, overflow: 'hidden' }}>
                                                    <View style={{ backgroundColor: '#000', borderRadius: 10, paddingRight: 10, paddingVertical: 20, gap: 30 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ flex: 1, fontSize: 25, fontWeight: '500', color: 'tomato', marginLeft: 10 }}>{item.UserName}</Text>
                                                            <View style={{ width: '45%', flexDirection: 'column', alignItems: 'center' }}>
                                                                <View>
                                                                    <Text style={{ color: '#fff' }}>Last Match</Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 20, color: 'tomato', marginLeft: 13, padding: 0, width: '40%' }}>{item.Time}</Text>
                                                                    <Text style={{ fontSize: 20, color: 'tomato', padding: 0 }}>|</Text>
                                                                    <Text style={{ fontSize: 20, color: 'tomato', padding: 0, textAlign: 'center', width: '50%' }}>{item.Result}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    {
                                                        list?.length == 1 ? (
                                                            <View style={{ flex: 1, backgroundColor: '#141414', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
                                                                <Text style={{ fontSize: 20, fontWeight: '500', color: '#555555', marginLeft: 10 }}>No Any User, Create New User</Text>
                                                            </View>
                                                        ) : (null)
                                                    }

                                                </View>
                                            ) : (
                                                <TouchableOpacity key={index} onPress={() => { navigation.navigate('Game', { id: index, user: item.UserName }) }}>
                                                    <View key={index} style={{ backgroundColor: '#141414', marginBottom: 15, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 20, gap: 30 }}>
                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ flex: 1, fontSize: 25, fontWeight: '500', color: '#c4c4c4', marginLeft: 10 }}>{item.UserName}</Text>
                                                            <Text style={{ fontSize: 20, color: '#777777', marginLeft: 10, padding: 0, width: '15%' }}>{item.Time}</Text>
                                                            <Text style={{ fontSize: 20, color: 'tomato', marginLeft: 10, padding: 0 }}>|</Text>
                                                            <Text style={{ fontSize: 20, color: '#777777', marginLeft: 10, padding: 0, width: '20%', textAlign: 'center' }}>{item.Result}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )

                                            }
                                        </React.Fragment>
                                    )
                                })
                            }

                        </ScrollView>
                    )}
                </View>

                <TouchableOpacity onPress={createuser}>
                    <View style={{ backgroundColor: 'tomato', paddingVertical: 9, paddingHorizontal: 9, paddingBottom: 10, marginVertical: 25, borderRadius: 7 }}>
                        <Text style={{ color: '#fff', textAlign: 'center', letterSpacing: 2, fontSize: 20, fontWeight: '500' }}>Create New User</Text>
                    </View>
                </TouchableOpacity>

            </View >
        </>
    )
}

export default Home;