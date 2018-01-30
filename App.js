import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { List, ListItem, Button } from "react-native-elements";

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
                  data: [],
                  zipcode: '',
                  city: '',
                  state: '',
                  error: ''
                };
  }

  componentWillMount () {
    navigator.geolocation.getCurrentPosition(
    (position) => {
      let weatherApiUrl = 'https://api.wunderground.com/api/b5ebea340f8512c6/forecast/geolookup/q';
      let extension = 'json';

      return fetch(`${weatherApiUrl}/${parseFloat(position.coords.latitude.toFixed(1))},${parseFloat(position.coords.longitude.toFixed(1))}.${extension}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({data: responseJson.forecast.txt_forecast.forecastday, city: responseJson.location.city, state: responseJson.location.state});
      });
    },
    (error) => console.log(error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
}

  render() {

    const fetchWeather = event => {

      let weatherApiUrl = 'https://api.wunderground.com/api/b5ebea340f8512c6/forecast/geolookup/q/';
      let searchZip = this.state.zipcode;
      let extension = 'json';

      return fetch(`${weatherApiUrl}/${searchZip}.${extension}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({data: responseJson.forecast.txt_forecast.forecastday, zipcode: '', city: responseJson.location.city, state: responseJson.location.state, error: ''});
      })
      .catch((error) => {
        this.setState({error: 'something went wrong. try a different zipcode', zipcode: '', city: '', state: '', data: []});
      });
    };

    return (
      <View style={styles.container}>
        <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder="zipcode goes here.."
          onChangeText={(zipcode) => this.setState({zipcode})}
          value={this.state.zipcode}
          keyboardType='numeric'
          maxLength={5}
          />
        <Button
         title="get weather!"
         backgroundColor='#87CEEB'
         onPress={fetchWeather}
       />
        </View>
        <View style={styles.weather}>
        <View>
          { this.state.error ?
              <Text style={{padding: 10, fontSize: 25, textAlign: 'center'}}>{`${this.state.error}`}</Text>
            :
              <Text style={{padding: 10, fontSize: 42, textAlign: 'center'}}>{`${this.state.city}\u00A0${this.state.state}`}</Text>
          }
        </View>
          <List containerStyle={{borderTopWidth: 0}}>
            <FlatList
             data={this.state.data}
             keyExtractor={item => item.period}
             renderItem={({ item }) => (
                <ListItem
                roundAvatar
                hideChevron
                title={`${item.title}`}
                subtitle={`${item.fcttext}`}
                subtitleNumberOfLines={3}
                subtitleStyle={{fontSize: 9}}
                avatar={{ uri: 'https' + item.icon_url.split('http')[1] }}
                avatarStyle={{backgroundColor: 'white', borderRadius: 0}}
                />
              )}
            />
          </List>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: .9,
  },
  search: {
    flex: .3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  weather: {
    flex: 1
  },
  input: {
    height: 40,
    borderBottomWidth: 1
  }
});
