import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    Image,
    StyleSheet,
    ScrollView,
    Platform,
    Touchable,
    TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES, FONTS, icons} from '../constants'


const MovieDetail = ({navigation, route}) => {

    const [selectedMovie, setSelectedMovie] = React.useState(null)

    React.useEffect(() => {
        let { selectedMovie } = route.params
        setSelectedMovie(selectedMovie)
    }, [])

    function renderHeaderBar() {
        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    marginTop: Platform.OS == 'ios' ? 40 : 20,
                    paddingHorizontal: SIZES.padding
            }}
            >
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 20,
                        backgroundColor: COLORS.transparentBlack
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image 
                        source={icons.left_arrow}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 20,
                        backgroundColor: COLORS.transparentBlack
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image 
                        source={icons.upload}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: COLORS.white
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderHeaderSection() {
        return (
            <ImageBackground
                source={selectedMovie?.details.image}
                resizeMode="cover"
                style={{
                    width: "100%",
                    height: SIZES.height < 700 ? SIZES.height * 0.6 : SIZES.height * 0.7
                }}
            >
                <View
                    style={{
                        flex: 1
                    }}
                >
                    {renderHeaderBar()}
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-end"
                        }}
                    >
                        <LinearGradient
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            colors={['transparent', "#000"]}
                            style={{
                                width: "100%",
                                height: 150,
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.white,
                                    ...FONTS.body4
                                }}
                            >{selectedMovie?.details.season}</Text>
                            <Text
                                style={{
                                    marginTop: SIZES.base,
                                    color: COLORS.white,
                                    ...FONTS.h1
                                }}
                            >{selectedMovie?.name}</Text>
                        </LinearGradient>
                    </View>
                </View>
            </ImageBackground>
        )
    }

    function renderCategoryAndRatings(){
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: SIZES.base,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >

            </View>
        )
    }

    return (
        <ScrollView
            contentContainerStyle={{flex:1, backgroundColor: COLORS.black}}
            style={{backgroundColor: COLORS.black}}
        >
            {renderHeaderSection()}
            {renderCategoryAndRatings()}
        </ScrollView>
    )
}


const style = StyleSheet.create({
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SIZES.base,
        paddingVertical: 3,
        borderRadius: SIZES.base,
        backgroundColor: COLORS.gray1
    }
})

export default MovieDetail;