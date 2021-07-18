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
    ScrollView,
    TextInput
} from 'react-native';
import { dummyData, COLORS, FONTS, SIZES, icons, images } from '../constants'

const Search = ({navigation, route}) => {
    useEffect(() => {
        getData()
    }, [])

    const [search, setSearch] = React.useState("")

    async function getData() {
        await fetch('https://yts.mx/api/v2/list_movies.json?with_rt_ratings=true')
            .then(response => response.json() )
            .then(data => {
                setMovies(data.data.movies)
            })
            .catch(error => console.log(error));
    }

    async function getSearch(data){
        setSearch(data)
        await fetch('https://yts.mx/api/v2/list_movies.json?query_term=' + data)
            .then(response => response.json() )
            .then(data => {
                setMovies(data.data.movies)
            })
            .catch(error => console.log(error));
    }

    const [movies, setMovies] = useState([])

    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 15,
                    marginBottom: 15,
                    paddingHorizontal: SIZES.padding
                }}
            >
                <TextInput
                    style={{
                        backgroundColor: COLORS.white,
                        width: "90%",
                        borderRadius: 30
                    }}
                    placeholder="Search"
                    onChangeText={getSearch.bind(this)}
                />

                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50
                    }}
                    onPress={()=> getSearch()}
                >
                    <Image
                        source={icons.right_arrow}
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
                    >Search: "{search}"</Text>
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
                {renderRecentAddedAll()}
                {renderCategories()}
            </ScrollView>

        </SafeAreaView>
    )
}


export default Search
