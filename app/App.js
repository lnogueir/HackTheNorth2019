import React from 'react';
import { Text, View, Image, Picker} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { systemWeights } from 'react-native-typography'

const SERGIO_URL = 'http://192.168.0.20.:5000'

export default class HTN_app extends React.Component {
  constructor(props){
    super(props);
      this.languages=[];
      this.state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        photo64: null,
        camera_mode: false,
        photo_mode: false,
        photo: null,
        audio: null,
        word:null,
        selected_language:'en',
        is_result_page:false,
        is_loading:false,
        home_mode:true
      };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.get_languages()
    this.setState({ hasCameraPermission: status === 'granted' });
    this.speak('','home');

  }

  speak = async (endpoint='', message='') => {
      var param = message!=''?'?message='+message:'';
      if(this.state.word == null){
        const { sound: soundObject, status } = await Audio.Sound.createAsync(
          {uri:SERGIO_URL+param, headers:{'Cache-Control':'no-cache'}},
          { shouldPlay: true });
      }else{
        const { sound: soundObject, status } = await Audio.Sound.createAsync(
          {uri:SERGIO_URL+endpoint+'?prediction='+this.state.word+'&language='+this.state.selected_language, headers:{'Cache-Control':'no-cache'}},
          { shouldPlay: true });
      }
  }

  snap = async () => {
      if (this.camera) {
        let photo = await this.camera.takePictureAsync({ base64: true})
        .then((data)=> {
          this.setState({
            photo64: data.base64,
            photo: data.uri
        }, console.log(data.uri))
         this.speak('','photo_screen') 
        })
      }
  };


  get_languages = async() => {
      let req_url = SERGIO_URL + '/get_languages'
      try{
        fetch(req_url)
        .then((response) => response.json())
        .then((response)=>{
          this.languages = response.languages
        })
      }catch(error){
        console.log(error)
      }

  }

  send_photo = async (endpoint, data) =>{
    let req_url = SERGIO_URL + endpoint
    let data_json = JSON.stringify(data)
    let req_info = {
      method: 'POST',
      dataType: 'jsonp',
      headers: {
        'Accept':'application/json',
                'Content-Type':'application/json',
              },
      body:data_json
      }
    try{
      fetch(req_url, req_info)
      .then((response)=>response.json())
      .then((response)=>{
        this.setState({word:response.word.replace(' ', '%20'), is_loading:false})
        this.speak('/image_speak');
      })
    }catch(error){
      console.log(error)
    }
  }

  render() {
    if (this.state.hasCameraPermission === null) {
      return null;
    }
    if(this.state.photo_mode){
      return (
        <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
        <Text style={[systemWeights.thin,{margin:15, fontSize:24}]}>Are you ready to listen to your photo?</Text>
          <Image
            style={{width: 175, height: 325, marginTop:30}}
            source={{uri:this.state.photo}}
          />
          <Button type='outline' style={{margin:50}} title='Check it out' onPress={() => {
            this.setState({is_loading:true,is_result_page:true, photo_mode:false})
            this.send_photo('/image_write', {"image_base64":this.state.photo64, 'language':this.state.selected_language});
          }}/>
        </View>
      );
    }
    else if (!this.state.hasCameraPermission) {
      return <Text>No access to camera</Text>;
    } else if(this.state.home_mode){
      return (
        <View style={{flex:1, margin: 40,alignItems:'center', height:'100%', flexDirection:'column'}}>
          <Image
            style={{width: 125, height: 170}}
            source={require('./assets/senses.png')}
          />
          <Text style={[systemWeights.thin, {fontSize:50}]}>Senses</Text>
          <View style={{marginTop:25,margin:10,flexDirection:'row', justifyContent:'space-evenly'}}>
          <Text style={[systemWeights.semibold,{paddingRight:40, fontSize:17}]}>A new language{'\n'}each snap:</Text>
          <Button borderRadius={90} icon={<Icon
                name="camera"
                size={35}
                color="black"
              />}
              buttonStyle={{paddingLeft:30, backgroundColor:'white'}}
              title='' onPress={()=>{
              this.setState({camera_mode: true, home_mode:false})
          }}/>
          </View>
          <View style={{margin:40, alignItems:'center'}}>
          <Text style={[systemWeights.thin, {fontSize:18}]}>Select a Language:</Text>
          <Picker
            style={{margin:30}}
            selectedValue={this.state.selected_language}
            style={{height: 50, width: 100}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({selected_language: itemValue})
            }>
            <Picker.Item label={'Scroll...'} key={400} value={'en'}/>
            {this.languages.map( (x,i) => {
                  return( <Picker.Item label={x.name} key={i} value={x.language}  />)} )}
          </Picker>
          </View>
        </View>
      );
    }else if(this.state.camera_mode && this.state.hasCameraPermission){
      return (
        <View style={{ flex: 1 }}>
        <Camera
        ref={ref => {
         this.camera = ref;
        }}
        style={{ flex: 1 }} type={this.state.type}>
          <View
            style={{
              position: 'absolute',
              bottom:0,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              backgroundColor: 'transparent',
              flexDirection: 'row'
            }}>
            <Button
              type='clear'
              name=''
              icon={
                <Icon
                      name="retweet"
                      size={35}
                      color="gray"
                    />
              }
              buttonStyle={{backgroundColor:'transparent'}}
              onPress={() => {
                this.setState({
                  type:
                    this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                });
              }}
            />
            <Button
              title=''
              icon={
                <Icon
                  name="camera"
                  size={40}
                  color="white"
                />
              }
              buttonStyle={{backgroundColor:'gray'}}
              onPress={() => {
                this.setState({camera_mode:false, photo_mode:true})
                this.snap()
              }}
            />
            <Button
              title=''
              icon={
                <Icon
                  name="home"
                  size={35}
                  color="gray"
                />
              }
              buttonStyle={{backgroundColor:'transparent'}}
              onPress={() => this.setState({camera_mode:false, home_mode:true})}
            />
          </View>
        </Camera>
        </View>
      );
    }else if(this.state.is_result_page && this.state.is_loading){
      return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Button type='clear' title='will load' loading={true}/>
        </View>
      );
    }else if(this.state.is_result_page && !this.state.is_loading){
      return(
        <View style={{flex:1, padding: 20,alignItems:'center', justifyContent:'center'}}>
          <Text style={[systemWeights.thin,{fontSize:30, marginVertical:20}]}>The photo you took is saying:</Text>
          <Text style={[systemWeights.bold,{fontSize:20}]}>{this.state.word.replace('%20', ' ')}!</Text>
          <Button icon={<Icon name='home' color='white' size={30}/>} buttonStyle={{marginTop:50, backgroundColor: '#1968e8'}} title='Back to home' onPress={()=>{this.setState({word: null,is_result_page:false, home_mode:true})}}/>
        </View>
    )
    }
    else{
       return null;
    }
  }
}
