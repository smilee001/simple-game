import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = ({ navigation, route }) => {

    const [DataList, setDataList] = useState([]);
    const [id, setId] = useState(null);

    const getData = async () => {

        console.log('Data1', DataList);
        try {
            const jsonValue = await AsyncStorage.getItem('myList');
            if (jsonValue !== null) {
                const parsedData = JSON.parse(jsonValue);
                setDataList(parsedData);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        console.log('id:', id);
    }, [id])

    useEffect(() => {
        setId(route.params.id);
        getData();
    }, [])

    useEffect(() => {
        console.log('DataList in useEffect:', DataList);
        console.log(DataList[id]);
    }, [DataList]);

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.tableHeader}>
                    <Text style={styles.usernameHeader}>User Name</Text>
                </View>
                <View style={styles.table}>

                    {DataList[id]?.History.map((item, index) => (
                        <React.Fragment key={index}>
                            {index === 0 ? (
                                <View>
                                    <View style={[styles.tableRow, { borderBottomWidth: 2, borderBottomColor: '#999999' }]}>
                                        <Text style={styles.headerText}>{item.MatchNo}</Text>
                                        <Text style={styles.headerText}>{item.Time}</Text>
                                        <Text style={styles.headerText}>{item.Result}</Text>
                                    </View>

                                    {DataList[id]?.History?.length === 1 ? (
                                        <View style={styles.emptyContainer}>
                                            <Text style={styles.emptyText}>No History Available</Text>
                                        </View>
                                    ) : (null)
                                    }
                                </View>

                            ) : (
                                <View style={[styles.tableRow, { borderBottomWidth: index === DataList[id]?.History?.length - 1 ? 0 : 1 }]}>
                                    <Text style={styles.cell}>{item.MatchNo}</Text>
                                    <Text style={styles.cell}>{item.Time}</Text>
                                    <Text style={styles.cell}>{item.Result}</Text>
                                </View>
                            )}
                        </React.Fragment>
                    ))}

                </View>
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    emptyContainer: {
        height: 650,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 20,
        color: '#555555',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    table: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        borderWidth: 2,
        borderColor: '#999999'
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomColor: '#dddddd'
    },

    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 10
    },

    usernameHeader: {
        flex: 2,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    headerText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
    },
    cell: {
        flex: 1,
        fontSize: 16,
        color: '#555555',
        textAlign: 'center',
    },
});

export default History;