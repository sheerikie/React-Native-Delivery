import React, { Component, Fragment } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { HideWithKeyboard } from 'react-native-hide-with-keyboard'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import ErrorMessage from '../components/ErrorMessage'
import AppLogo from '../components/AppLogo'
import { withFirebaseHOC } from '../config/Firebase'
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import firebase from 'firebase';


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have at least 6 characters ')
})


class Login extends Component {
  state = {
    passwordVisibility: true,
    rightIcon: 'ios-eye',
    user: null
  }


  goToSignup = () => this.props.navigation.navigate('Signup')
  goToForgotPassword = () => this.props.navigation.navigate('ForgotPassword')

  handlePasswordVisibility = () => {
    this.setState(prevState => ({
      rightIcon: prevState.rightIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
      passwordVisibility: !prevState.passwordVisibility
    }))
  }

  handleOnLogin = async (values, actions) => {
    const { email, password } = values
    try {
      const response = await this.props.firebase.loginWithEmail(email, password)

      if (response.user) {
        this.props.navigation.navigate('App')
      }
    } catch (error) {
      actions.setFieldError('general', error.message)
    } finally {
      actions.setSubmitting(false)
    }
  }
  

  //Google signIn
  

  loginWithGoogle = async () => {
    try {
      const responce = await Expo.AppAuth.authAsync({
        issuer: 'https://accounts.google.com',
        scopes: ['profile'],
        clientId: '136218394506-tsboac36r1n4qb2078e6urub1javgter.apps.googleusercontent.com',
      });
      if (type === 'success') {
      
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };
  
  signOutAsync = async () => {
    try {
      await GoogleSignIn.signOutAsync();
      this.setState({ user: null });
    } catch ({ message }) {
      alert('signOutAsync: ' + message);
    }
  };



  //End Google Sign In
//login with facebook


async  loginWithFacebook(){
  try {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync('2508272469442579', {
      permissions: ['public_profile'],
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      try {
      const response = await this.props.firebase.loginWithFacebook(credential);
        if (response.user) {
          this.props.navigation.navigate('App')
        }
      } catch (error) {
        console.log('general', error.message)
      } finally {
        console.log('error')
      }
    } else {
      // type === 'cancel'
    }
  } catch ({ message }) {
    alert(`Facebook Login Error: ${message}`);
  }
}



//end login with facebook
  render() {
    const { passwordVisibility, rightIcon } = this.state
    return (
      <SafeAreaView style={styles.container} accessibilityLabel="testview">
      <ScrollView>
        <HideWithKeyboard style={styles.logoContainer}>
          <AppLogo />
        </HideWithKeyboard>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, actions) => {
            this.handleOnLogin(values, actions)
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting
          }) => (
            <Fragment>
              <FormInput
                testID={'email'}
                accessibilityLabel="text"
                name='email'
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder='Enter email'
                autoCapitalize='none'
                iconName='ios-mail'
                iconColor='#2C384A'
                onBlur={handleBlur('email')}
              />
              <ErrorMessage errorValue={touched.email && errors.email} />
              <FormInput
                testID={'password'}
                name='password'
                value={values.password}
                accessibilityLabel="text"
                onChangeText={handleChange('password')}
                placeholder='Enter password'
                secureTextEntry={passwordVisibility}
                iconName='ios-lock'
                iconColor='#2C384A'
                onBlur={handleBlur('password')}
                rightIcon={
                  <TouchableOpacity onPress={this.handlePasswordVisibility}>
                    <Ionicons name={rightIcon} size={28} color='grey' />
                  </TouchableOpacity>
                }
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <View style={styles.buttonContainer}>
                <FormButton
                  testID={'loginButton'}
                  accessibilityLabel="button"
                  buttonType='outline'
                  onPress={handleSubmit}
                  title='LOGIN'
                  buttonColor='#039BE5'
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                />
              <ErrorMessage errorValue={errors.general} />
               
                 <Button style={{ marginTop: 50 }}
                  testID={'facebookButton'}
                  title='FaceBook Login'
                  full
                  rounded
                  primary
                  onPress={() => this.loginWithFacebook()}
                >
            
          </Button>
              </View>
             
            </Fragment>
          )}
        </Formik>
        <Button
          testID={'signUpButton'}
          title="Don't have an account? Sign Up"
          onPress={this.goToSignup}
          titleStyle={{
            color: '#F57C00'
          }}
          type='clear'
        />
        <Button
          testID={'forgotButton'}
          title='Forgot Password?'
          onPress={this.goToForgotPassword}
          titleStyle={{
            color: '#039BE5'
          }}
          type='clear'
        />
         </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20
  },
  logoContainer: {
    marginBottom: 7,
    alignItems: 'center'
  },
  buttonContainer: {
    margin: 13
  }
})

export default withFirebaseHOC(Login)
