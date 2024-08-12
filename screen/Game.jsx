import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const Game = ({ navigation, route }) => {

    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);

    const [DataList, setDataList] = useState([]);

    const [id, setId] = useState(null);
    const [user, setUser] = useState(null);

    const [matchno, setMatchno] = useState(0);

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
        setUser(route.params.user)
        getData();
    }, [])

    useEffect(() => {
        console.log('DataList in useEffect:', DataList);
        console.log(DataList[id]);

        const dataItem = DataList[id];

        if (dataItem && dataItem.History) {
            setMatchno(dataItem.History.length);
        }

    }, [DataList, id]);

    // useEffect(() => {
    //     console.log('HDataList:', HDataList);
    // }, [HDataList])

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds === 59 ? 0 : seconds + 1);
                setMinutes((minutes) => seconds === 59 ? minutes + 1 : minutes);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsActive(true);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setIsActive(false);
        });
        return unsubscribe;
    }, [navigation]);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        if (squares.every(square => square !== null)) {
            return 'Tie';
        }
        return null;
    };

    const handleClick = (i) => {
        const squares = [...board];
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = 'X';
        setBoard(squares);

        if (calculateWinner(squares)) {
            setIsActive(false);
            return;
        }

        setXIsNext(false);
    };

    useEffect(() => {
        if (!xIsNext) {
            makeComputerMove([...board]);
        }
    }, [xIsNext]);

    const makeComputerMove = (squares) => {
        const updatedSquares = squares.slice();

        const winningMove = findWinningMove(updatedSquares);
        if (winningMove !== null) {
            updatedSquares[winningMove] = 'O';
        } else {
            const blockingMove = findBlockingMove(updatedSquares);
            if (blockingMove !== null) {
                updatedSquares[blockingMove] = 'O';
            } else {
                const emptySquares = updatedSquares
                    .map((square, index) => (!square ? index : null))
                    .filter((index) => index !== null);
                const randomIndex = Math.floor(Math.random() * emptySquares.length);
                const randomSquare = emptySquares[randomIndex];
                updatedSquares[randomSquare] = 'O';
            }
        }

        setBoard(updatedSquares);

        if (calculateWinner(updatedSquares)) {
            setIsActive(false);
        } else {
            setXIsNext(true);
        }
    };

    const findWinningMove = (squares) => {
        for (let i = 0; i < squares.length; i++) {
            if (!squares[i]) {
                squares[i] = 'O';
                if (calculateWinner(squares) === 'O') {
                    return i;
                }
                squares[i] = null;
            }
        }
        return null;
    };

    const findBlockingMove = (squares) => {
        for (let i = 0; i < squares.length; i++) {
            if (!squares[i]) {
                squares[i] = 'X';
                if (calculateWinner(squares) === 'X') {
                    return i;
                }
                squares[i] = null;
            }
        }
        return null;
    };

    const scaleValue = useRef(new Animated.Value(1)).current;

    const scaleUp = () => {
        Animated.timing(scaleValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const scaleDown = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const renderSquare = (i) => {
        return (
            <TouchableOpacity style={{ backgroundColor: '#000' }} onPress={() => handleClick(i)}>
                <Animated.View
                    style={{
                        transform: [{ scale: scaleValue }],
                    }}
                    onTouchStart={scaleUp}
                    onTouchEnd={scaleDown}
                >
                    <Text style={[styles.square, { color: board[i] === 'X' ? '#02FFFC' : '#FB0206' }, { textShadowColor: board[i] === 'X' ? '#02FFFC' : '#FB0206' }]}>{board[i]}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const winner = calculateWinner(board);
    let status;
    if (winner) {
        if (winner === 'Tie') {
            status = 'Match Tie';
        } else {
            status = 'Winner : ' + winner;
        }

        let time = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        if (winner == 'X') {
            // console.log('win', time);
            DataList[id].Result = 'Win';
            DataList[id].Time = time;
        }
        else if (winner === 'Tie') {
            // console.log('Tie', time);
            DataList[id].Result = 'Tie';
            DataList[id].Time = time;
        } else {
            // console.log('lose', time);
            DataList[id].Result = 'Lose';
            DataList[id].Time = time;
        }

        const newHistoryItem = {
            MatchNo: DataList[id].History?.length,
            Time: DataList[id].Time,
            Result: DataList[id].Result
        };

        console.log('newitem', newHistoryItem);

        DataList[id].History = [...DataList[id].History, newHistoryItem];

        try {
            console.log(DataList);
            AsyncStorage.setItem('myList', JSON.stringify(DataList))
                .then(() => {
                    navigation.navigate('Home');
                })
                .catch((error) => {
                    console.error('Error saving data:', error);
                });
        } catch (e) {
            console.error(e);
        }

        // navigation.navigate('Home');

    } else {
        status = (xIsNext ? 'X' : 'O');
    }

    const goBackAlert = () => {
        Alert.alert(
            "Go Back",
            "Are you sure you want to go back?",
            [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "Yes", onPress: () => navigation.navigate('Home') }
            ],
            { cancelable: false }
        );
    };

    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={goBackAlert}>
                        <Icon name='chevron-back-outline' type='ionicon' color='#666666' size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tic-Tac-Toe</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('History', { id: id })}>
                    <Text style={styles.viewHistory}>View History</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.container}>

                <View style={styles.statusContainer}>
                    <View style={styles.playerInfo}>
                        <View style={[styles.statusBox, styles.playerBox]}>
                            <Text style={[styles.statusText, { color: '#02FFFC' }]}>Player :</Text>
                            <Text style={[styles.statusText, { color: '#02FFFC' }]}>{user}</Text>
                        </View>
                        <View style={[styles.statusBox, styles.matchBox]}>
                            <Text style={[styles.statusText, { color: '#02FFFC' }]}>Match No. :</Text>
                            <Text style={[styles.statusText, { color: '#02FFFC' }]}>{matchno}</Text>
                        </View>
                    </View>
                    <View style={styles.turnTimeBox}>
                        <View style={[styles.statusBox, styles.turnBox]}>
                            <Text style={[styles.statusText, { color: '#02FFFC' }]}>Turn :</Text>
                            <Text style={[styles.statusText, { color: '#02FFFC' }]}>{status}</Text>
                        </View>
                        <View style={[styles.statusBox, styles.timeBox]}>
                            <Text style={[styles.statusText, { color: '#02FFFC' }]}>
                                {minutes < 10 ? '0' + minutes : minutes} : {seconds < 10 ? '0' + seconds : seconds}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.boardContainer}>
                    <View style={styles.boardRow}>
                        {renderSquare(0)}
                        {renderSquare(1)}
                        {renderSquare(2)}
                    </View>
                    <View style={styles.boardRow}>
                        {renderSquare(3)}
                        {renderSquare(4)}
                        {renderSquare(5)}
                    </View>
                    <View style={styles.boardRow}>
                        {renderSquare(6)}
                        {renderSquare(7)}
                        {renderSquare(8)}
                    </View>
                </View>
                <View></View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#121111',
        paddingHorizontal: 15,
        height: 60,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -13,
    },
    headerTitle: {
        color: '#c2c2c2',
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 10,
    },
    viewHistory: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '500',
    },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'blue',
        borderWidth: 3.5,
        borderRadius: 22,
        padding: 4,
        gap: 5,
        overflow: 'hidden'
    },

    playerInfo: {
        flexDirection: 'column',
        gap: 5
    },

    statusBox: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 3,
        borderColor: 'red'
    },

    playerBox: {
        borderTopStartRadius: 15
    },

    matchBox: {
        borderBottomStartRadius: 15
    },

    turnBox: {
        borderTopEndRadius: 15
    },

    turnTimeBox: {
        flexDirection: 'column',
        gap: 5
    },

    timeBox: {
        borderBottomEndRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },

    statusText: {
        fontSize: 25,
        textAlign: 'center'
    },

    boardContainer: {
        flexDirection: 'row',
        gap: 5,
        backgroundColor: 'blue',
        borderWidth: 5,
        borderColor: 'blue',
        borderRadius: 20,
        overflow: 'hidden',
        marginTop: 10,
    },

    boardRow: {
        flexDirection: 'column',
        gap: 5,
    },

    square: {
        width: 120,
        height: 120,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 50,
        fontWeight: '500',
        backgroundColor: '#000',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },

});

export default Game;