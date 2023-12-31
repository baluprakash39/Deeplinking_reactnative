import React, { useRef, useState } from "react"
import { StyleSheet, View, Text, Button, Linking, TextInput, Alert, TouchableOpacity,ImageBackground } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
// import { firebaseConfig } from "../config";
import { firebaseConfig } from "./firebaseConfig";
import firebase from "firebase/compat/app";

import PhoneInput from 'react-native-phone-number-input';


const Otp = ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState('null');
    const recaptchaVerifier = useRef(null);

    const phoneInput = React.useRef(null);

    const getPhoneNumber = () => {
        Alert.alert(phoneNumber)
    }

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
            .then(setVerificationId);
        setPhoneNumber('');

    };


    const showAlert = () => {
        Alert.alert(
            'Login Suceessfull',
            'Go to some screen',
            [{
                text: 'Okay',
                onPress: () => {
                    navigation.navigate('Home')
                }
            }]
        )
    }

    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
        );
        firebase.auth().signInWithCredential(credential)
            .then(() => {
                setCode('');
                // Alert.alert('Login Successfully.')
                showAlert()
            })
            .catch((error) => {
                //show an alert in case ot err
                Alert(error);
            })

    }

    return (

        <ImageBackground
        source={require('./assets/redlight.jpg')} // Replace with the actual path to your background image
        style={styles.container}
      >
        <View style={styles.container}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
            />
            

            <View style={styles.contain}>
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={phoneNumber}
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.texInput}

                    onChangeFormattedText={text => {
                        setPhoneNumber(text);
                    }}
                    defaultCode="IN"
                    layout='first'
                    withShadow
                    autoFocus
                />
            </View>
            <TouchableOpacity style={styles.sendVerification} onPress={() => { sendVerification(); getPhoneNumber() }}>
                <Text style={styles.buttonText}>

                    Send Verification

                </Text>
            </TouchableOpacity>

            <TextInput
                placeholder="Confirm code"
                onChangeText={setCode}
                keyboardType='number-pad'
                style={styles.textInput}
            />
            <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
                <Text style={styles.buttonText}>

                    Confirm Verification

                </Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>

    )
}

export default Otp


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 15
    },
    contain: {
        rowGap: 15
    },


    textInput: {
        //    paddingTop: 40,
        //     paddingBottom: 20,
        paddingHorizontal: 30,
        fontSize: 20,
        //    borderBottomColor: "#fff",
        //     borderBottomWidth: 2,
        marginBottom: 5,
        textAlign: 'center',
        //     color: '#fff',
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: '#fff'

    },
    phoneContainer: {
        width: '90%',
        height: 50,
        borderColor: '#fff'
    },
    sendVerification: {
        padding: 20,
        backgroundColor: '#3498db',
        borderRadius: 10,

    },
    sendCode: {
        padding: 20,
        backgroundColor: '#9b59b6',
        borderRadius: 10,
    },
    buttonText: {
        textAlign: "center",
        color: '#fff',
        fontWeight: "600"
    },
    otpText: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#fff',
        margin: 20
    },
    text: {
        color: 'white',
        fontWeight: '600'
    },
    texInput: {
        paddingVertical: 0,
    }

}); 