import React, { useState, createRef } from "react";
import {  Dimensions, View, ScrollView, TouchableOpacity,  Image, StyleSheet, Text, Platform } from "react-native";
import { Colors, Fonts, Sizes,CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '@rneui/themed';
import MyStatusBar from "../../components/myStatusBar";

const API_URL = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://localhost:5000';

const { width } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {

    const [state, setState] = useState({
        fullName: null,
        password: null,
        passwordSecure: true,
        email: null,
        phoneNumber: null,
    })

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');

    const onLoggedIn = token => {
        callNextPage();
        fetch(`${API_URL}/private`, {
            mode: 'no-cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setMessage(jsonRes.message);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    }

    const callNextPage = () => {
        navigation.push('BottomTabBar');
    }


    const onSubmitHandler = () => {
        const payload = {
            email,
            name,
            password,
        };
        // 'Access-Control-Allow-Origin':'https://justpatties.ca/justpatties-ca-backend',
        console.log(payload)
        fetch(`${API_URL}/${isLogin ? 'signup' : 'signup'}`, {
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Origin':'http://localhost:5000',
                'Access-Control-Allow-Methods':'POST',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setIsError(true);
                    setMessage(jsonRes.message);
                } else if(res.status == 200){
                    navigation.push('BottomTabBar')
                } else {
                    onLoggedIn(jsonRes.token);
                    setIsError(false);
                    setMessage(jsonRes.message);
                   // navigation.push('BottomTabBar')
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    //onPress={() => navigation.push('BottomTabBar')}

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        fullName,
       // password,
        passwordSecure,
      //  email,
        phoneNumber,
    } = state;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                {foodLogo()}
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding, }}
                >
                    {signupTitle()}
                    {fullNameTextField()}
                    {emailTextField()}
                    {phoneNumberTextField()}
                    {passwordTextField()}
                    {signupButton()}
                    {orConnectWithDivider()}
                    {socialMediaOptions()}
                    {alreadyAccountInfo()}
                </ScrollView>
            </View>
        </View>
    )

    function foodLogo() {
        return (
            <Image
                source={require('../../assets/images/bg1.png')}
                style={styles.foodLogoStyle}
            />
        )
    }

    function alreadyAccountInfo() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ ...Fonts.grayColor15Medium }}>
                    Already have an account?
                </Text>
                <Text
                    onPress={() => navigation.push('Signin')}
                    style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.blackColor15Medium }}
                >
                    Sign In
                </Text>
            </View>
        )
    }

    function socialMediaOptions() {
        return (
            <View style={styles.socialMediaOptionsWrapStyle}>
                {socialMediaOptionsSort({
                    icon: require('../../assets/images/icons/twitter_icon.png'),
                    bgColor: '#1DA1F2',
                })}
                {socialMediaOptionsSort({
                    icon: require('../../assets/images/icons/google_icon.png'),
                    bgColor: '#EA4335',
                })}
                {socialMediaOptionsSort({
                    icon: require('../../assets/images/icons/facebook_icon.png'),
                    bgColor: '#4267B2',
                })}
            </View>
        )
    }

    function socialMediaOptionsSort({ icon, bgColor }) {
        return (
            <View style={{
                ...styles.socialMediaIconWrapstStyle,
                backgroundColor: bgColor,
            }}>
                <Image
                    source={icon}
                    style={{ width: 18.0, height: 18.0, resizeMode: 'contain' }}
                />
            </View>
        )
    }

    function orConnectWithDivider() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: Colors.grayColor, height: 1.0, flex: 1, }} />
                <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.grayColor15Medium }}>
                    Or Connect with
                </Text>
                <View style={{ backgroundColor: Colors.grayColor, height: 1.0, flex: 1, }} />
            </View>
        )
    }

    function signupButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onSubmitHandler}
                //onChangeHandler
                //onPress={() => navigation.push('BottomTabBar')}
               // onPress={() => navigation.push('BottomTabBar')}
                style={styles.signupButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Sign Up
                </Text>
            </TouchableOpacity>
        )
    }

    function passwordTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={password}
                onChangeText={setPassword}
                //onChangeText={(text) => updateState({ password: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Password'
                placeholderTextColor={Colors.grayColor}
                leftIcon={{
                    type: 'material',
                    color: Colors.grayColor,
                    name: 'lock-outline',
                    size: 20,
                    onPress: () => { input.current.focus() }
                }}
                secureTextEntry={passwordSecure}
                rightIcon={{
                    type: 'material-community',
                    color: Colors.grayColor,
                    name: passwordSecure ? 'eye-off-outline' : 'eye-outline',
                    size: 16,
                    onPress: () => { updateState({ passwordSecure: !passwordSecure }) }
                }}
                style={{ ...Fonts.blackColor15Medium, marginLeft: Sizes.fixPadding - 2.0 }}
                inputContainerStyle={{ ...styles.textFieldWrapStyle }}
                containerStyle={styles.textFieldStyle}
            />
        )
    }

    function phoneNumberTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={phoneNumber}
                onChangeText={(text) => updateState({ phoneNumber: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Phone Number'
                placeholderTextColor={Colors.grayColor}
                keyboardType="phone-pad"
                leftIcon={{
                    type: 'material-community',
                    color: Colors.grayColor,
                    name: 'cellphone',
                    size: 20,
                    onPress: () => { input.current.focus() }
                }}
                style={{ ...Fonts.blackColor15Medium, marginLeft: Sizes.fixPadding - 2.0 }}
                inputContainerStyle={{ ...styles.textFieldWrapStyle }}
                containerStyle={{ marginBottom: Sizes.fixPadding * 3.0, ...styles.textFieldStyle }}
            />
        )
    }

    function emailTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={email}
                onChangeText={setEmail}
                //onChangeText={(text) => updateState({ email: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Email Address'
                placeholderTextColor={Colors.grayColor}
                leftIcon={{
                    type: 'material-community',
                    color: Colors.grayColor,
                    name: 'email-outline',
                    size: 20,
                    onPress: () => { input.current.focus() }
                }}
                keyboardType="email-address"
                style={{ ...Fonts.blackColor15Medium, marginLeft: Sizes.fixPadding - 2.0 }}
                inputContainerStyle={{ ...styles.textFieldWrapStyle }}
                containerStyle={{ marginBottom: Sizes.fixPadding * 3.0, ...styles.textFieldStyle }}
            />
        )
    }

    function fullNameTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={fullName}
                onChangeText={setName}
                selectionColor={Colors.primaryColor}
                placeholder='Full Name'
                placeholderTextColor={Colors.grayColor}
                leftIcon={{
                    type: 'material',
                    color: Colors.grayColor,
                    name: 'person-outline',
                    size: 20,
                    onPress: () => { input.current.focus() }
                }}
                style={{ ...Fonts.blackColor15Medium, marginLeft: Sizes.fixPadding - 2.0 }}
                inputContainerStyle={{ ...styles.textFieldWrapStyle }}
                containerStyle={{ marginBottom: Sizes.fixPadding * 3.0, marginTop: Sizes.fixPadding * 2.0, ...styles.textFieldStyle }}
            />
        )
    }

    function signupTitle() {
        return (
            <Text style={{ marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
                Sign Up
            </Text>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back-ios"
                    color={Colors.blackColor}
                    size={22}
                    onPress={() => navigation.pop()}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
    },
    textFieldStyle: {
        height: 40.0,
        width: width - 25.0,
        alignSelf: 'center',
    },
    textFieldWrapStyle: {
        paddingHorizontal: Sizes.fixPadding,
        elevation: 1.0,
        borderRadius: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderBottomWidth: 0.0,
        ...CommonStyles.shadow
    },
    signupButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 4.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(255, 66, 0, 0.3)',
        borderWidth: 1.0,
        elevation: 1.0,
        shadowColor: Colors.primaryColor,
    },
    socialMediaOptionsWrapStyle: {
        marginVertical: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialMediaIconWrapstStyle: {
        width: 38.0,
        height: 38.0,
        borderRadius: 19.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding - 5.0,
    },
    foodLogoStyle: {
        width: 160,
        height: 160,
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
    }
});

export default SignupScreen;