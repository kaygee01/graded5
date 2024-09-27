import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { moderateScale } from "react-native-size-matters";
import CustomBorderBtn from './components/CustomBorderBtn';
import CustomSolidBtn from './components/CustomSolidBtn';
import CustomTextInput from './components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './FBconfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
    const navigation = useNavigation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const validate = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = form.email?.trim() || '';

        if (trimmedEmail === '') {
            newErrors.email = 'Please enter an email';
            valid = false;
        } else if (!emailRegex.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email';
            valid = false;
        }

        if (form.password === '') {
            newErrors.password = 'Please enter a password';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const trimmedEmail = form.email.trim().toLowerCase();
                const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, form.password);
                const uid = userCredential.user.uid;
                const userDocRef = doc(db, 'users', uid); 
                const userDoc = await getDoc(userDocRef); 
                
                if (userDoc.exists()) {
                    setForm({ email: '', password: '' });
                    navigation.navigate('FlashcardList', { uid });
                } else {
                    setErrors({ ...errors, password: 'User does not exist in the database.' });
                }
            } catch (error) {
                console.error('Login error:', error);
                setErrors({ ...errors, password: 'Invalid email or password.' });
            } finally {
                setLoading(false);
            }
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <CustomTextInput
                value={form.email}
                onChangeText={txt => handleChange('email', txt)}
                title={"Email"}
                placeholder={'xyz@gmail.com'}
                bad={errors.email !== ''}
            />
            {errors.email !== '' && <Text style={styles.errorMsg}>{errors.email}</Text>}
            <CustomTextInput
                value={form.password}
                onChangeText={txt => handleChange('password', txt)}
                title={'Password'}
                placeholder={'********'}
                secureTextEntry={true}
                bad={errors.password !== ''}
            />
            {errors.password !== '' && <Text style={styles.errorMsg}>{errors.password}</Text>}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            <View style={styles.buttonContainer}>
                <CustomSolidBtn
                    title={'Login'}
                    onClick={handleLogin}
                />
                <CustomBorderBtn
                    title={'Create Account'}
                    onClick={() => navigation.navigate('SignUp')}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', 
        padding: moderateScale(20),
    },
    title: {
        fontWeight: '600',
        fontSize: moderateScale(25),
        textAlign: 'center',
        marginBottom: moderateScale(20),
    },
    errorMsg: {
        color: 'red',
        marginBottom: moderateScale(10),
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: moderateScale(20),
    },
});

export default Login;
