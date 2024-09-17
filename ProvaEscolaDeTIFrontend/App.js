import { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Api from './Api/Api'; 

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      viagens: [],
      count: 1
    }
  }
  async componentDidMount(){
    let viagens = await Api.get("/viagem")
    console.log(viagens)
    this.setState({viagens: viagens})
    this.setState({count: this.state.count + 1})
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.count}</Text>
        <Text>teste: {this.state.viagens}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
