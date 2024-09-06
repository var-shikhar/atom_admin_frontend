import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { FireToast } from '../../../context/toastContext.js';
import useCategoryForm from '../../../hooks/admin/forms/useCategory.js';
import useSubCategoryForm from '../../../hooks/admin/forms/useSubCategory.js';
import VALIDATION from '../../../util/validation.js';

const CategoryForm = ({ id, handleConfirmation }) => {
    const { defaultValue, handleFormSubmisstion } = useCategoryForm(id);
    return (
        <Formik
            initialValues={defaultValue}
            enableReinitialize
            validationSchema={VALIDATION.categoryFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                   await handleFormSubmisstion(values, handleConfirmation)
                } catch (err) {
                    FireToast({ title: 'Error', subTitle: err.response?.data?.message || 'Category Creation failed' });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, dirty, isValid }) => {
                return (
                    <Form className='row rounded border shadow-lg p-4 m-2'>
                        <FormGroup className='col-12'>
                            <FormLabel htmlFor="name">Category Name</FormLabel>
                            <Field
                                name="name"
                                type="text"
                                placeholder='Electronics'
                                as={FormControl}
                                isInvalid={!!(errors.name && touched.name)}
                            />
                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12'>
                            <FormLabel htmlFor="description">Category Description</FormLabel>
                            <Field
                                name="description"
                                as="textarea"
                                placeholder="Category Description.."
                                rows={3}
                                className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                            />
                            <ErrorMessage name="description" component="div" className="invalid-feedback" />
                        </FormGroup>
                       
                        <div className='col-12 my-2 my-md-4'>
                            <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                                {id === '' ? 'Create Category' : 'Update Category'}
                            </Button>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );
};

const SubCategoryForm = ({ id, handleConfirmation }) => {
    const { categoryList, defaultValue, handleFormSubmisstion } = useSubCategoryForm(id);
    return (
        <Formik
            initialValues={defaultValue}
            enableReinitialize
            validationSchema={VALIDATION.subCategoryFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                   await handleFormSubmisstion(values, handleConfirmation)
                } catch (err) {
                    FireToast({ title: 'Error', subTitle: err.response?.data?.message || 'Category Creation failed' });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, dirty, isValid }) => {
                return (
                    <Form className='row rounded border shadow-lg p-4 m-2'>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="categoryID">Select Category</FormLabel>
                            <Field
                                name="categoryID"
                                as="select"
                                placeholder="Select..."
                                className={`form-control ${errors.categoryID && touched.categoryID ? 'is-invalid' : ''}`}
                            >
                                <option value={''} disabled>Select ...</option>
                                {categoryList?.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </Field>
                            <ErrorMessage name="categoryID" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="name">Sub Category Name</FormLabel>
                            <Field
                                name="name"
                                type="text"
                                placeholder='Mobile Phone'
                                as={FormControl}
                                isInvalid={!!(errors.name && touched.name)}
                            />
                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12'>
                            <FormLabel htmlFor="description">Sub Category Description</FormLabel>
                            <Field
                                name="description"
                                as="textarea"
                                placeholder="Category Description.."
                                rows={3}
                                className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                            />
                            <ErrorMessage name="description" component="div" className="invalid-feedback" />
                        </FormGroup>
                       
                        <div className='col-12 my-2 my-md-4'>
                            <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                                {id === '' ? 'Create Sub-Category' : 'Update Sub-Category'}
                            </Button>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default { CategoryForm, SubCategoryForm };
