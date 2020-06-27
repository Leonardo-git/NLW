import React, {useState, useEffect} from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image, ImageBackground, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {

    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    function handleNavigateToPoints(){
        navigation.navigate('Points', {
            selectedUf,
            selectedCity,
        });
    }

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response =>{
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {
        if(selectedUf === '0'){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        })

    },[selectedUf]);
    
    return (
        <ImageBackground 
        source={require('../../assets/background.png')} 
        style={styles.container} 
        imageStyle={{width: 274, height: 368}}>
            <View style={styles.main}>
                <Image style={styles.imageTop} source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.selectArea}>
                <View style={styles.select}>
                    <Picker 
                        style={{flex: 1}}
                        selectedValue={selectedUf}
                        onValueChange={(itemValue) => setSelectedUf(itemValue)}
                    >   
                        {ufs.map((item, index) => (
                            <Picker.Item key={index} label={String(item)} value={item} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.select}>
                    <Picker
                        style={{flex: 1}}
                        selectedValue={selectedCity}
                        onValueChange={(itemValue) => setSelectedCity(itemValue)}
                    >   
                        {cities.map((item, index) => (
                            <Picker.Item key={index} label={String(item)} value={item} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                        <Icon name="arrow-right" color="#fff" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>                    
                </RectButton>
            </View>
        </ImageBackground>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    selectArea: {
        marginVertical: 15,
    },

    select: {
        backgroundColor: '#fff',
        marginVertical: 5,
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    imageTop: {
        maxWidth: 240,
        resizeMode: "contain",
    },
});

export default Home;