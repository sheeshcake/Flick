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
    BackHandler,
    Picker
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar } from '../components'
import {COLORS, SIZES, FONTS, icons} from '../constants';
import TorrentStreamer from 'react-native-torrent-streamer';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TvShowDetail = ({navigation, route}) => {

    const [selectedShow, setsSelectedShow] = React.useState(null)
    const [stream, setStream] = React.useState({
        progress: 0,
        buffer: 0,
        downloadSpeed: 0,
        seeds: 0,
        status: "Idle",
        file: "none"
    })
    const [season, setSeason] = React.useState("1")
    const [isplaying, setIsPlaying] = React.useState(false)

    React.useEffect(async () => {
        BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);
        setIsPlaying(false)
        getData()
        getMovieData()
        getSuggestionData()
    },[])

    function hardwareBackPress(){
        stopMovie()
        BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress);
    }


    async function getMovieData(){
        console.log(route.params.selectedMovie)
        await fetch('https://oneom.is/serial/' + route.params.selectedMovie, {headers: {
            'Accept': 'application/json'}})
            .then(response => response.json() )
            .then(data => {
                setsSelectedShow(data.data)
                console.log(data.data.serial.ep)
            })
            .catch(error => console.log(error));
    }

    function createData(){
        try {
            AsyncStorage.setItem("movie-" + route.params.selectedMovie, JSON.stringify(stream))
            console.log("data created!");
        } catch (e) {
            console.log(e)
        }
    }

    async function getData(){
        try {
            const value = await AsyncStorage.getItem("movie-" + route.params.selectedMovie)
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
        TorrentStreamer.addEventListener('error', onError)
        TorrentStreamer.addEventListener('status', onStatus.bind(this))
        TorrentStreamer.addEventListener('ready', onReady.bind(this))
        TorrentStreamer.addEventListener('stop', onStop.bind(this))
        // await fetch('https://yts.mx/api/v2/movie_suggestions.json?movie_id=' + route.params.selectedMovie)
        //     .then(response => response.json() )
        //     .then(data => {
        //         setSuggestion(data.data.movies)
        //     })
        //     .catch(error => console.log(error));
    }


    function playMovie(url) {
        setStream({...stream, status: "Opening"})
        setIsPlaying(true)
        TorrentStreamer.start(url[0].url)
    }

    function stopMovie() {
        AsyncStorage.setItem("movie-" + route.params.selectedMovie, JSON.stringify(stream))
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
        setIsPlaying(false)
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
        setStream({...stream, file: data})
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
                source={{uri: selectedShow?.serial.poster.original}}
                resizeMode="cover"
                style={{
                    width: "100%",
                    height: SIZES.height < 700 ? SIZES.height * 0.6 : SIZES.height * 0.7,
                    marginBottom: 100
                }}
                blurRadius={10}
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
                                    source={{uri: selectedShow?.serial.poster.original}}
                                />
                                <Text
                                    style={{
                                        marginTop: SIZES.base,
                                        color: COLORS.white,
                                        ...FONTS.h1
                                    }}
                                >
                                    {selectedShow?.serial.title}
                                    </Text>
                                
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
                    >
                        {selectedShow?.serial.imdb_rating}
                    </Text>
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
                        {selectedShow?.serial.genre.map((item, index) => {return (item.name + " ")})}
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
                    >
                        {selectedShow?.serial?.description[0].body.replace(/(<([^>]+)>)/gi, "")}
                    </Text>
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
                        {/* Seeds {stream.seeds != 0 ? stream.seeds : selectedMovie?.torrents[0].seeds} */}
                        </Text>
                    <Text
                        style={{color: COLORS.white,...FONTS.h4}}
                    >{stream?.status + ":" + parseFloat(stream?.progress).toFixed(2) + "%"}{stream.downloadSpeed != 0 ? "(" + (stream.downloadSpeed / 1024).toFixed(2) + "Kbps)" : null}</Text>

                </View>
                <TouchableOpacity
                    style={{
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: Platform.OS == 'os' ? SIZES.padding * 2 : 0,
                        borderRadius: 15,
                        backgroundColor: COLORS.primary
                    }}
                    // onPress={() => playMovie(selectedMovie?.torrents)}
                >
                            <Text>{
                                            stream.buffer < 100 && stream.buffer > 0 ?
                                                "Buffering: " + stream.buffer + "%"
                                            : stream.buffer == 100 ?
                                                "Continue Watching"
                                            : isplaying?
                                                "Opening Please wait.."
                                            :
                                                "Watch Now!"
                                }</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function renderEpisodes(){
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
                        alignItems: 'center',
                        padding: 5
                    }}
                >
                    <Text style={{color: COLORS.white, marginRight: 20, ...FONTS.h2}}>Season: </Text>
                    <View
                        style={{
                            backgroundColor: COLORS.white,
                            borderRadius: 5
                        }}
                    >
                        <Picker
                            selectedValue={season}
                            style={{
                                height: 50,
                                width: 200,
                                backgroundColor: COLORS.primary,
                                color: COLORS.black,
                            }}
                            onValueChange={(itemValue, itemIndex) => setSeason(itemValue)}
                        >
                            {selectedShow?.serial?.ep.map((item, index) => {
                                return(
                                    item.season != selectedShow?.serial?.ep[index -1]?.season ?
                                        <Picker.Item style={{color: COLORS.black}} label={item.season} key={item.season} value={item.season} /> 
                                    : null
                                )
                            })}
                        </Picker>
                    </View>
                </View>
                <View
                    style={{
                        marginTop: 20,
                        borderBottomColor: COLORS.white,
                        borderWidth: 1,
                    }}
                >
                    {selectedShow?.serial.ep.map((item, index) => {
                        console.log(item)
                        return (
                            item.season == season ?
                                <View
                                    style={{
                                        padding: 20,
                                        borderWidth: 1,
                                        borderTopColor: COLORS.white,
                                    }}
                                >
                                    <Text style={{color: COLORS.white}}>{item.title}{item.torrent.length == 0 ? "(Comming soon)" : null}</Text>
                                </View>
                            :
                            null
                        )
                    })}
                </View>
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
                {renderEpisodes()}
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

export default TvShowDetail;