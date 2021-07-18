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
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackHandler
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar } from '../components'
import {COLORS, SIZES, FONTS, icons} from '../constants';
import TorrentStreamer from 'react-native-torrent-streamer';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MovieDetail = ({navigation, route}) => {

    const [selectedMovie, setSelectedMovie] = React.useState(null)
    const [stream, setStream] = React.useState({
        progress: 0,
        buffer: 0,
        downloadSpeed: 0,
        seeds: 0,
        status: "Idle"
    })
    const [suggestion, setSuggestion] = React.useState([])
    let isplaying = false

    React.useEffect(async () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        isplaying = false
        getData()
        getMovieData()
        getSuggestionData()
    },[])


    function hardwareBackPress(){
        stopMovie()
    }


    async function getMovieData(){
        await fetch('https://yts.mx/api/v2/movie_details.json?movie_id=' + route.params.selectedMovie.id)
        .then(response => response.json() )
        .then(data => {
            setSelectedMovie(data.data.movie)
            // console.log(data.data)
        })
        .catch(error => console.log(error));
    }

    function createData(){
        try {
            AsyncStorage.setItem("movie-" + route.params.selectedMovie.id, JSON.stringify(stream))
            console.log("data created!");
        } catch (e) {
            console.log(e)
        }
    }

    async function getData(){
        try {
            const value = await AsyncStorage.getItem("movie-" + route.params.selectedMovie.id)
            if(value == null) {
                createData()
            }else{
                setStream(JSON.parse(value))
            }
        }catch(e){
            console.log(e)
        }
                
    }

    async function getSuggestionData(){
        console.log(route.params.selectedMovie.id)
        await fetch('https://yts.mx/api/v2/movie_suggestions.json?movie_id=' + route.params.selectedMovie.id)
            .then(response => response.json() )
            .then(data => {
                setSuggestion(data.data.movies)
            })
            .catch(error => console.log(error));
    }


    function playMovie(url) {
        setStream({...stream, status: "Opening"})
        isplaying = true
        TorrentStreamer.addEventListener('error', onError)
        TorrentStreamer.addEventListener('status', onStatus.bind(this))
        TorrentStreamer.addEventListener('ready', onReady.bind(this))
        TorrentStreamer.addEventListener('stop', onStop.bind(this))
        TorrentStreamer.start(url[0].url)
    }

    function stopMovie() {
        AsyncStorage.setItem("movie-" + route.params.selectedMovie.id, JSON.stringify(stream))
        if(stream.status == "Downloading"){
            setStream({
                progress: 0,
                buffer: 0,
                downloadSpeed: 0,
                seeds: 0,
                status: "Stopped"
              }, () => {
                TorrentStreamer.stop()
              })
        }
        isplaying = false
    }
    

    function onError(e){
        console.log(e)
    }
    
    function onStatus({progress, buffer, downloadSpeed, seeds}){
        setStream({
            progress: progress,
            buffer: buffer,
            downloadSpeed: downloadSpeed,
            seeds: seeds,
            status: "Downloading"
        })
    }

    
    function onReady(data){
        TorrentStreamer.open(data.url, 'video/mp4')
    }
    function onStop(data){
        console.log('stop')
    }

    function renderHeaderBar() {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    marginTop: Platform.OS == 'ios' ? 40 : 20,
                    marginBottom: Platform.OS == 'ios' ? 40 : 20,
                    paddingHorizontal: SIZES.padding,
                    backgroundColor: 'transparent',
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
                    onPress={() => {
                        stopMovie()
                        navigation.goBack()
                    }}
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
                source={{uri: selectedMovie?.background_image_original}}
                resizeMode="cover"
                style={{
                    width: "100%",
                    height: SIZES.height < 700 ? SIZES.height * 0.6 : SIZES.height * 0.7,
                    marginBottom: 100
                }}
            >
                <View
                    style={{
                        flex: 1
                    }}
                >
                    
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
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image
                                    style={{
                                        justifyContent: 'center',
                                        borderRadius: 20,
                                        width: 300,
                                        height: 300,
                                    }}
                                    resizeMode="contain"
                                    source={{uri: selectedMovie?.large_cover_image}}
                                />
                                <Text
                                    style={{
                                        marginTop: SIZES.base,
                                        color: COLORS.white,
                                        ...FONTS.h1
                                    }}
                                >{selectedMovie?.title}</Text>
                                
                            </View>
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
                <View
                    style={[
                        styles.categoryContainer,
                        {
                            marginLeft: 0
                        }
                    ]}
                >
                    <Image
                        source={icons.star}
                        resizeMode="contain"
                        style={{
                            width: 15,
                            height: 15
                        }}
                    />
                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.h4
                        }}
                    >{selectedMovie?.rating}</Text>
                </View>
                <View
                    style={styles.categoryContainer}
                >
                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.h4
                        }}
                    >
                        {selectedMovie?.genres.map((item, index) => {return (item + " ")})}
                    </Text>
                </View>
            </View>
        )
    }

    function renderMovieDetails() {
        return (
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: SIZES.padding,
                    marginTop: SIZES.padding,
                    marginBottom: 20,
                    justifyContent: 'space-around'
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.h3
                        }}
                    >{selectedMovie?.description_full}</Text>
                </View>
                <ProgressBar 
                    containerStyle={{
                        marginTop: SIZES.radius,
                    }}
                    barStyle={{
                        height: 5,
                        borderRadius: 3
                    }}
                    barPercentage={stream.progress + "%"}
                />
                <View
                    style={{
                        flexDirection: 'row',
                        marginBottom: SIZES.radius
                    }}
                >
                    <Text
                        style={{flex: 1, color: COLORS.white,...FONTS.h4}}
                    >
                        Seeds {stream.seeds != 0 ? stream.seeds : selectedMovie?.torrents[0].seeds}
                        </Text>
                    <Text
                        style={{color: COLORS.white,...FONTS.h4}}
                    >{stream?.status + ":" + parseFloat(stream?.progress).toFixed(2) + "%"}{stream.downloadSpeed != 0 ? "(" + (stream.downloadSpeed / 1024).toFixed(2) + "Kbps)" : null}</Text>
                </View>
                {isplaying == false ?
                    <TouchableOpacity
                        style={{
                            height: 60,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: Platform.OS == 'os' ? SIZES.padding * 2 : 0,
                            borderRadius: 15,
                            backgroundColor: COLORS.primary
                        }}
                        onPress={() => playMovie(selectedMovie?.torrents)}
                    >
                                <Text>{stream.buffer == 0 ? "Watch Now" : "Buffering: " + stream.buffer + "%"}</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={{
                            height: 60,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: Platform.OS == 'os' ? SIZES.padding * 2 : 0,
                            borderRadius: 15,
                            backgroundColor: COLORS.primary
                        }}
                        onPress={() => stopMovie()}
                    >
                                <Text>Stop Downloading</Text>
                    </TouchableOpacity> 
                }
            </View>
        )
    }

    function renderSuggested(){
        return (
            <View
                style={{
                    marginTop: SIZES.padding,
                    zIndex: 5
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
                    >More Like This</Text>
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
                    data={suggestion}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({item,index}) => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => navigation.push("MovieDetail", {
                                    selectedMovie: item
                                })}
                            >
                                <View
                                    style={{
                                        marginLeft: index == 0 ? SIZES.padding : 20,
                                        marginRight: index == suggestion.length - 1 ? SIZES.padding : 0
                                    }}
                                >
                                    <Image
                                        source={{uri: item.medium_cover_image}}
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

    return (
        <View
            contentContainerStyle={{flex:1, backgroundColor: 'transparent', flexGrow: 1, paddingBottom: 100}}
            automaticallyAdjustContentInsets={true}
            style={{backgroundColor: 'transparent'}}
        >
            <View
                style={{
                    position: 'absolute',
                    zIndex: 5,
                    flex: 1,
                    width: '100%'
                }}
            >
                {renderHeaderBar()}
            </View>
            <ScrollView
                contentContainerStyle={{backgroundColor: COLORS.black}}
            >
                {renderHeaderSection()}
                {renderCategoryAndRatings()}
                {renderMovieDetails()}
                {renderSuggested()}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SIZES.base,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: SIZES.base,
        backgroundColor: COLORS.gray1
    }
})

export default MovieDetail;