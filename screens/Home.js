import React, { useEffect, useState} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    ImageBackground,
    Animated,
    FlatList,
    ScrollView
} from 'react-native';
import { dummyData, COLORS, FONTS, SIZES, icons, images } from '../constants'

const Home = ({ navigation }) => {

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        await fetch('https://yts.mx/api/v2/list_movies.json?with_rt_ratings=true&limit=5&sort_by=date_added')
            .then(response => response.json() )
            .then(data => {
                setNewMovies(data.data.movies)
            })
            .catch(error => console.log(error));
        await fetch('https://yts.mx/api/v2/list_movies.json?with_rt_ratings=true')
            .then(response => response.json() )
            .then(data => {
                setMovies(data.data.movies)
            })
            .catch(error => console.log(error));
    }

    const [movies, setMovies] = useState([])
    const [newmovies, setNewMovies] = useState([])

    const newSeasonScrollX = React.useRef(new Animated.Value(0)).current;

    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: SIZES.padding
                }}
            >
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50
                    }}
                    onPress={()=> console.log("home")}
                >
                    <Image
                        source={icons.flick}
                        style={{
                            width: 100,
                            height: 40,
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50
                    }}
                    onPress={()=> console.log("screen mirror")}
                >
                    <Image
                        source={icons.airplay}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: COLORS.primary
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }


    function renderRecentAdded() {
        return (
            <Animated.FlatList
                horizontal
                pagingEnabled
                snapToAlignment="center"
                snapToInterval={SIZES.width}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                decelerationRate={0}
                contentContainerStyle={{
                    marginTop: SIZES.radius
                }}
                data={newmovies}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { x: newSeasonScrollX} } }
                ], { useNativeDriver: false })}
                renderItem={({item,index}) => {
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("MovieDetail", { selectedMovie: item } )}
                        >
                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <ImageBackground
                                    source={{uri: item.large_cover_image}}
                                    resizeMode="cover"
                                    style={{
                                        width: SIZES.width * 0.85,
                                        height: SIZES.width * 0.85,
                                        justifyContent: 'flex-end'
                                    }}
                                    imageStyle={{
                                        borderRadius: 40
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            height: 60,
                                            width: "100%",
                                            marginBottom: SIZES.radius,
                                            paddingHorizontal: SIZES.radius
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <View
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                    backgroundColor: COLORS.transparentWhite
                                                }}
                                            >
                                                <Image
                                                    source={icons.play}
                                                    resizeMode="contain"
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        tintColor: COLORS.white
                                                    }}
                                            
                                                />
                                            </View>
                                            <Text
                                                    style={{
                                                        marginLeft: SIZES.base,
                                                        color: COLORS.white,
                                                        ...FONTS.h3
                                                    }}
                                                >Play Now</Text>
                                        </View>
                                        <Text
                                            style={{
                                                flex: 1,
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                color: COLORS.white,
                                                ...FONTS.h2,
                                                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                                textShadowOffset: {width: -1, height: 1},
                                                textShadowRadius: 10
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>
                                </ImageBackground>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }}
            >

            </Animated.FlatList>
        )
    }

    function renderDots(){
        
        const dotPosition = Animated.divide(newSeasonScrollX, SIZES.width)

        return (
            <View
                style={{
                    marginTop: SIZES.padding,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {newmovies.map((item,index) => {

                    const opacity = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    })

                    const dotWidth = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [6, 20, 6],
                        extrapolate: 'clamp'
                    })

                    const dotColor = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [COLORS.lightGray, COLORS.primary, COLORS.lightGray],
                        extrapolate: 'clamp'
                    })

                    return (
                        <Animated.View
                            key={`dot-${index}`}
                            opacity={opacity}
                            style={{
                                borderRadius: SIZES.radius,
                                marginHorizontal: 3,
                                width: dotWidth,
                                height: 6,
                                backgroundColor: dotColor
                            }}
                        >

                        </Animated.View>
                    )
                })}
            </View>
        )
    }

    function renderRecentAddedAll(){
        return (
            <View
                style={{
                    marginTop: SIZES.padding
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: SIZES.padding,
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            flex: 1,
                            color: COLORS.white,
                            ...FONTS.h2
                        }}
                    >Recently Added</Text>
                    <Image
                        source={icons.right_arrow}
                    />
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        marginTop: SIZES.padding
                    }}
                    data={movies}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({item,index}) => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => navigation.navigate("MovieDetail", {
                                    selectedMovie: item
                                })}
                            >
                                <View
                                    style={{
                                        marginLeft: index == 0 ? SIZES.padding : 20,
                                        marginRight: index == movies.length - 1 ? SIZES.padding : 0
                                    }}
                                >
                                    <Image
                                        source={{uri: item.large_cover_image}}
                                        resizeMode="cover"
                                        style={{
                                            width: SIZES.width / 3,
                                            height: (SIZES.height / 3) + 60,
                                            borderRadius: 20
                                        }}
                                    />
                                    <Text
                                        style={{
                                            flex: 1,
                                            marginTop: SIZES.base,
                                            color: COLORS.white,
                                            flexWrap: 'wrap',
                                            width: SIZES.width / 3,
                                            ...FONTS.h4
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }}
                />
            </View>
        )
    }

    function renderCategories(){

    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.black
            }}
        >
            {renderHeader()}
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 100
                }}
            >
                {renderRecentAdded()}
                {renderDots()}
                {renderRecentAddedAll()}
                {renderCategories()}
            </ScrollView>

        </SafeAreaView>
    )
}

export default Home;