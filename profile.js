import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomBorderBtn from './components/CustomBorderBtn';
import CustomSolidBtn from './components/CustomSolidBtn';
import CustomTextInput from './components/CustomTextInput';
import { getAuth } from 'firebase/auth';
import { updateUserProfile, deleteUserAccount } from './cardActions';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ displayName: '', password: '' });
    const [errors, setErrors] = useState({ displayName: '', password: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = getAuth().currentUser;
            if (currentUser) {
                setUser(currentUser);
                setForm({ displayName: currentUser.displayName || '', password: '' });
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const validate = () => {
        let valid = true;
        const newErrors = { displayName: '', password: '' };

        if (form.displayName === '') {
            newErrors.displayName = 'Please enter a name';
            valid = false;
        }

        if (form.password !== '' && form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleUpdateProfile = async () => {
        if (validate()) {
            try {
                await updateUserProfile({ firstName: form.displayName, password: form.password });
                Alert.alert('Profile updated successfully!');
                setForm({ displayName: '', password: '' });
            } catch (error) {
                Alert.alert('Error updating profile:', error.message);
            }
        }
    };
    
    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            await deleteUserAccount(); // No UID needed now
                            Alert.alert("Account deleted successfully.");
                            navigation.navigate('Login'); // Redirect to Login screen
                        } catch (error) {
                            Alert.alert("Error deleting account:", error.message);
                        }
                    },
                },
            ]
        );
    };
    

    const handleLogout = async () => {
        await getAuth().signOut();
        navigation.navigate('Login');
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Profile Details</Text>
                <CustomTextInput
                    value={form.displayName}
                    onChangeText={txt => handleChange('displayName', txt)}
                    title={"Name"}
                    placeholder={'Enter your name'}
                    bad={errors.displayName !== ''}
                />
                {errors.displayName !== '' && <Text style={styles.errorMsg}>{errors.displayName}</Text>}

                <CustomTextInput
                    value={form.password}
                    onChangeText={txt => handleChange('password', txt)}
                    title={'Password'}
                    placeholder={'********'}
                    secureTextEntry={true}
                    bad={errors.password !== ''}
                />
                {errors.password !== '' && <Text style={styles.errorMsg}>{errors.password}</Text>}

                <View style={styles.buttonContainer}>
                    <CustomSolidBtn
                        title={'Update Profile'}
                        onClick={handleUpdateProfile}
                        icon={<Icon name="check" size={18} color="#fff" />} 
                    />

                    <CustomBorderBtn
                        title={'Delete Account'}
                        onClick={handleDeleteAccount}
                        icon={<Icon name="trash" size={18} color="#f4511e" />}
                    />

                    <CustomBorderBtn
                        title={'Logout'}
                        onClick={handleLogout}
                        icon={<Icon name="sign-out" size={18} color="#007BFF" />}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontWeight: '600',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorMsg: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
});

export default ProfileScreen;
