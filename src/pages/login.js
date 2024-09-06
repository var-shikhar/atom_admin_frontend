import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { startTransition, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext.js';
import { FireToast } from '../context/toastContext.js';
import useAxioRequests from '../function/axioRequest.js';
import ROUTES from '../util/routes.js';
import VALIDATION from '../util/validation.js';

const Login = () => {
    const { userID, setUserID, setUserData, userData } = useAuthContext();
    const {HandlePostRequest} = useAxioRequests();
    const navigate = useNavigate();

    useEffect(() => {
        if(userID !== '' && userData !== null){
            navigate(`../orders`);
        }
    }, [userID, userData, navigate])

    return (
        <div className='row h-100'>
            <div className='col-lg-5 col-md-6 col-12 mx-auto my-auto d-block position-relative'>
                <div className="background">
                    <div className="shape"></div>
                    <div className="shape"></div>
                </div>
                <Formik
                    initialValues={{
                        userEmail: '', userPassword: '',
                    }}
                    enableReinitialize
                    validationSchema={VALIDATION.loginFormValidation}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const response = await HandlePostRequest({
                                route: ROUTES.loginRoute,
                                type: 'post',
                                data: values,
                                toastDescription: 'User has logged-in successfully',
                            });
                            if (response?.status === 200) {
                                const { userEmail, userID, userName, isAdmin } = response?.data;
                                const userDetails = {
                                    userID: userID,
                                    userName: userName,
                                    userEmail: userEmail,
                                    isAdmin: isAdmin,
                                }
                                startTransition(() => {
                                    setUserID(userID);
                                    setUserData(userDetails);
                                })
                            }
                        } catch (err) {
                            console.log(err)
                            FireToast({});
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ errors, touched, dirty, isValid }) => (
                        <Form className='w-75 mx-auto rounded border shadow-lg p-4 d-flex flex-column gap-4'>
                            <div className='h2 text-center'>Login Here</div>
                            <FormGroup >
                                <FormLabel htmlFor="userEmail">Email Address</FormLabel>
                                <Field
                                    name="userEmail"
                                    type="email"
                                    placeholder='user@example.com'
                                    as={FormControl}
                                    isInvalid={!!(errors.userEmail && touched.userEmail)}
                                />
                                <ErrorMessage name="userEmail" component="div" className="invalid-feedback" />
                            </FormGroup>  

                            <FormGroup >
                                <FormLabel htmlFor="userPassword">Password</FormLabel>
                                <Field
                                    name="userPassword"
                                    type="password"
                                    placeholder='******'
                                    as={FormControl}
                                    isInvalid={!!(errors.userPassword && touched.userPassword)}
                                />
                                <ErrorMessage name="userPassword" component="div" className="invalid-feedback" />
                            </FormGroup>

                           <div>
                                <Button type="submit" disabled={!(dirty && isValid)}>
                                    Sign-In
                                </Button>
                           </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
