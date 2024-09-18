import { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  ScrollView
} from 'react-native';
import Api from './Api/Api';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viagens: [],
      destinos: [],
      viagemNomeInput: '',
      viagemValorInput: '',
      viagemDataChegadaInput: '',
      viagemDataSaidaInput: '',
      destinoNomeInput: '',
      idViagemDeleteInput: '',
      idDestinoDeleteInput: '',
      idViagemAdicionarDestinoInput: '',
      idDestinoAdicionarDestinoInput: '',
      idViagemRemoverDestinoInput: ''
    }
    this.possuiDestino = this.possuiDestino.bind(this)
    this.criarViagem = this.criarViagem.bind(this)
    this.criarDestino = this.criarDestino.bind(this)
    this.deletarViagem = this.deletarViagem.bind(this)
    this.deletarDestino = this.deletarDestino.bind(this)
    this.fetchViagem = this.fetchViagem.bind(this)
    this.fetchDestino = this.fetchDestino.bind(this)
    this.adicionarDestino = this.adicionarDestino.bind(this)
    this.removerDestino = this.removerDestino.bind(this)
  }
  async componentDidMount() {
    await this.fetchViagem()
    await this.fetchDestino()
  }

  possuiDestino(viagem) {
    if (viagem.destino)
      return <Text> {viagem.destino.nome}</Text>
    return <Text> A viagem não possui um destino cadastrado</Text>
  }

  async criarViagem() {
    var nomeDaViagem = this.state.viagemNomeInput
    if (nomeDaViagem.length <= 0) {
      alert('Nome da viagem não pode estar vazio!')
      return
    }

    var valorDaViagem = this.state.viagemValorInput
    if (valorDaViagem.length <= 0) {
      alert('Valor da viagem não pode estar em branco!')
      return
    }

    if (!Number(valorDaViagem)) {
      alert('Valor da viagem deve ser um número!')
      return
    }

    var dataChegadaDaViagem = this.state.viagemDataChegadaInput

    if (dataChegadaDaViagem.length <= 0) {
      alert('data de chegada deve estar preenchida!')
      return
    }

    if (isNaN(Date.parse(dataChegadaDaViagem))) {
      alert('data de chegada está no formato incorreto!')
      return
    }

    var dataSaidaDaViagem = this.state.viagemDataSaidaInput

    if (dataSaidaDaViagem.length <= 0) {
      alert('data de saída deve estar preenchida!')
      return
    }

    if (isNaN(Date.parse(dataSaidaDaViagem))) {
      alert('data de saida está no formato incorreto!')
      return
    }

    if (Date.parse(dataSaidaDaViagem) < Date.parse(dataChegadaDaViagem)) {
      alert('Data de saída não pode ser antes da data de chegada')
      return
    }

    let result = await Api.post('/viagem', {
      "nome": nomeDaViagem,
      "dataSaida": dataSaidaDaViagem,
      "dataChegada": dataChegadaDaViagem,
      "valor": Number(valorDaViagem)
    })
    await this.fetchViagem()
    await this.fetchDestino()
  }

  async criarDestino() {
    var nomeDoDestino = this.state.destinoNomeInput
    if (nomeDoDestino.length <= 0) {
      alert('Nome do destino não pode estar vazio!')
      return
    }
    let result = await Api.post('/destino', {
      "nome": nomeDoDestino
    })
    await this.fetchViagem()
    await this.fetchDestino()
  }

  async deletarViagem() {
    let idViagem = this.state.idViagemDeleteInput
    await Api.delete('/viagem/' + idViagem)
      .then(async (response) => {
        await this.fetchDestino()
        await this.fetchViagem()
      })
      .catch((err) => alert("Erro ao deletar viagem!" + err))
  }

  async deletarDestino() {
    let idDestino = this.state.idDestinoDeleteInput
    await Api.delete('/destino/' + idDestino)
      .then(async (response) => {
        await this.fetchDestino()
        await this.fetchViagem()
      })
      .catch((err) => alert("Erro ao deletar destino!" + err))
  }

  async adicionarDestino() {
    let idViagem = this.state.idViagemAdicionarDestinoInput
    let idDestino = this.state.idDestinoAdicionarDestinoInput

    Api.patch("/viagem/destino/adicionar/?" + "destinoId=" + idDestino + "&viagemId=" + idViagem)
      .then(async (response) => {
        await this.fetchDestino()
        await this.fetchViagem()
      })
      .catch((err) => alert("Erro ao adicionar destino!" + err))
  }

  async removerDestino() {
    let idViagem = this.state.idViagemRemoverDestinoInput
    Api.patch("/viagem/destino/remover/" + idViagem)
      .then(async (response) => {
        await this.fetchDestino()
        await this.fetchViagem()
      })
      .catch((err) => alert("Erro ao adicionar destino!" + err))
  }

  async fetchViagem() {
    let viagens = await Api.get("/viagem")
    this.setState({ viagens: viagens.data })
  }

  async fetchDestino() {
    let destinos = await Api.get("/destino")
    this.setState({ destinos: destinos.data })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={{fontSize: 36, fontWeight:'heavy', textAlign: 'center'}}>GET METHODS</Text>
        <View style={styles.viagemDestinoContainer}>
          <View>
            <Text style={styles.titulo}>Viagens cadastradas:</Text>
            <FlatList
              data={this.state.viagens}
              renderItem={({ item, index }) =>
                <Text style={styles.description}>
                  {item.dataSaida.split('T')[0]} ~ {item.dataChegada.split('T')[0]}   {item.id}.{item.nome} - R${item.valor} -
                  {this.possuiDestino(item)}
                </Text>}
            />
          </View>

          <View>
            <Text style={styles.titulo}>Destinos cadastrados: </Text>
            <FlatList
              data={this.state.destinos}
              renderItem={({ item, index }) => <Text style={styles.description}>{item.id}.{item.nome}</Text>}
            />
          </View>
        </View>
        <Text style={{fontSize: 36, fontWeight:'heavy', textAlign: 'center'}}>POST METHODS</Text>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.titulo}>Cadastrar viagem:</Text>
            <TextInput style={styles.input}
              placeholder='Nome da viagem'
              onChangeText={(text) => this.setState({ viagemNomeInput: text })}
            />
            <TextInput style={styles.input}
              placeholder='Valor da viagem'
              onChangeText={(text) => this.setState({ viagemValorInput: text })}
            />
            <TextInput style={styles.input}
              placeholder='Data de início, favor usar `YYYY-MM-DD`'
              onChangeText={(text) => this.setState({ viagemDataChegadaInput: text })}
            />
            <TextInput style={styles.input}
              placeholder='Data de chegada, favor usar `YYYY-MM-DD`'
              onChangeText={(text) => this.setState({ viagemDataSaidaInput: text })}
            />
            <Button
              title="Criar viagem"
              onPress={this.criarViagem}
              color='#8196F3'
            />
          </View>

          <View style={styles.form}>
            <Text style={styles.titulo}>Cadastrar destino:</Text>
            <TextInput style={styles.input}
              placeholder='Nome do destino'
              onChangeText={(text) => this.setState({ destinoNomeInput: text })}
            />
            <Button
              title="Criar destino"
              onPress={this.criarDestino}
              color='#8196F3'
            />
          </View>
        </View>
        <Text style={{fontSize: 36, fontWeight:'heavy', textAlign: 'center'}}>DELETE METHODS</Text>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.titulo}>Deletar viagem</Text>
            <TextInput style={styles.input}
              placeholder='Id da viagem'
              onChangeText={(text) => this.setState({ idViagemDeleteInput: text })}
            />
            <Button
              title="Apagar viagem"
              onPress={this.deletarViagem}
              color='#FF0000'
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.titulo}>Deletar destino</Text>
            <TextInput style={styles.input}
              placeholder='Id do destino'
              onChangeText={(text) => this.setState({ idDestinoDeleteInput: text })}
            />
            <Button
              title="Apagar destino"
              onPress={this.deletarDestino}
              color='#FF0000'
            />
          </View>
        </View>
        <Text style={{fontSize: 36, fontWeight:'heavy', textAlign: 'center'}}>UPDATE/PATCH METHODS</Text>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.titulo}>Adicionar destino:</Text>
            <TextInput style={styles.input}
              placeholder='id da viagem'
              onChangeText={(text) => this.setState({ idViagemAdicionarDestinoInput: text })}
            />
            <TextInput style={styles.input}
              placeholder='id do destino'
              onChangeText={(text) => this.setState({ idDestinoAdicionarDestinoInput: text })}
            />
            <Button
              title="Adicionar destino"
              onPress={this.adicionarDestino}
              color='green'
            />
          </View>
          <View style={styles.form}>
            <Text style={styles.titulo}>Remover destino:</Text>
            <TextInput style={styles.input}
              placeholder='id do destino'
              onChangeText={(text) => this.setState({ idViagemRemoverDestinoInput: text })}
            />
            <Button
              title="Remover destino"
              onPress={this.removerDestino}
              color='red'
            />
          </View>
        </View>
      </ScrollView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#Aaeaea',
    paddingTop: 24
  },
  viagemDestinoContainer: {
    alignItems: 'flex-start',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 48
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center'
  },
  description: {
    fontSize: 16,
    textAlign: 'center'
  },
  form: {
    alignItems: 'center',
    height: 400
  },
  input: {
    height: 40,
    width: 400,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16
  },
  btn: {
    height: 40,
    width: 400,
  },
  formContainer: {
    alignItems: 'flex-start',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 48
  }
});
