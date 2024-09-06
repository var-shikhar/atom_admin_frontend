import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { startTransition } from 'react';
import { FormCheck } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import { FireToast } from '../../../context/toastContext.js';
import useProductForm from '../../../hooks/admin/forms/useProduct.js';
import useProductVariationForm from '../../../hooks/admin/forms/useProductVariation.js';
import VALIDATION from '../../../util/validation.js';

const ProductForm = ({ id, handleConfirmation }) => {
    const {apiData, defaultValue, handleFormSubmisstion, handleCategorySwitching} = useProductForm(id);

    async function handleProcessedFormData(values, imageArrayKeys) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (imageArrayKeys.includes(key) && Array.isArray(value)) {
                value.forEach((image, index) => {
                    if (image instanceof Blob) {
                        formData.append(key, image);
                    }
                });
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null) {
                formData.append(key, String(value));
            }
        });
    
        return formData;
    }

    return (
        <Formik
            initialValues={defaultValue}
            enableReinitialize
            validationSchema={VALIDATION.productFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const processedData = await handleProcessedFormData(values, ['images'])
                    await handleFormSubmisstion(processedData, handleConfirmation)
                } catch (err) {
                    console.log(err);
                    FireToast({ title: 'Error', subTitle: err.response?.data?.message || 'Product Creation failed' });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, dirty, isValid, values, setFieldValue }) => {  
                console.log(errors)
                // function handleSubCategory(value){
                //     const tempCategory = apiData.subCategoryList?.filter(item => item.categoryId._id === value);
                //     startTransition(() => {
                //         setAPIData(prev => ({...prev, filteredSubCategoryList: tempCategory}))
                //     })
                // }

                return (
                    <Form className='row rounded border shadow-lg p-4 m-2'>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="categoryID">Select Category</FormLabel>
                            <Field
                                name="categoryID"
                                as="select"
                                placeholder="Select..."
                                className={`form-control ${errors.categoryID && touched.categoryID ? 'is-invalid' : ''}`}
                                onChange={e => {
                                    const { value } = e.target;
                                    setFieldValue('categoryID', value);
                                    handleCategorySwitching(value)
                                    // handleSubCategory(value);
                                }}
                            >
                                <option value={''} disabled>Select ...</option>
                                {apiData.categoryList?.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </Field>
                            <ErrorMessage name="categoryID" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="subCategoryID">Select Sub-Category</FormLabel>
                            <Field
                                name="subCategoryID"
                                as="select"
                                placeholder="Select..."
                                className={`form-control ${errors.subCategoryID && touched.subCategoryID ? 'is-invalid' : ''}`}
                            >
                                <option value={''} disabled>Select ...</option>
                                {apiData.filteredSubCategoryList?.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
                            </Field>
                            <ErrorMessage name="subCategoryID" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="name">Product Name</FormLabel>
                            <Field
                                name="name"
                                type="text"
                                placeholder='Earbuds'
                                as={FormControl}
                                isInvalid={!!(errors.name && touched.name)}
                            />
                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="sku">Product SKU</FormLabel>
                            <Field
                                name="sku"
                                type="text"
                                placeholder='AT-ER-01'
                                as={FormControl}
                                isInvalid={!!(errors.sku && touched.sku)}
                            />
                            <ErrorMessage name="sku" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12'>
                            <FormLabel htmlFor="description">Product Description</FormLabel>
                            <Field
                                name="description"
                                as="textarea"
                                placeholder="Product Description.."
                                rows={4}
                                className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                            />
                            <ErrorMessage name="description" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 col-md-4'>
                            <FormLabel htmlFor="mrpPrice">Product MRP</FormLabel>
                            <Field
                                name="mrpPrice"
                                type="number"
                                placeholder="100"
                                min={0}
                                as={FormControl}
                                step={0.1}
                                isInvalid={!!(errors.mrpPrice && touched.mrpPrice)}
                            />
                            <ErrorMessage name="mrpPrice" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 col-md-4'>
                            <FormLabel htmlFor="sellingPrice">Product Selling Price</FormLabel>
                            <Field
                                name="sellingPrice"
                                type="number"
                                placeholder="100"
                                min={0}
                                max={values.mrpPrice}
                                as={FormControl}
                                step={0.1}
                                onChange={(e) => {
                                    const {value}  = e.target;
                                    if(value > values.mrpPrice){
                                        setFieldValue('sellingPrice', values.mrpPrice)
                                    } else {
                                        setFieldValue('sellingPrice', value)
                                    }
                                    
                                }}
                                isInvalid={!!(errors.sellingPrice && touched.sellingPrice)}
                            />
                            <ErrorMessage name="sellingPrice" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 col-md-4'>
                            <FormLabel htmlFor="stock">Product Stock</FormLabel>
                            <Field
                                name="stock"
                                type="number"
                                placeholder="100"
                                min={0}
                                as={FormControl}
                                isInvalid={!!(errors.stock && touched.stock)}
                            />
                            <ErrorMessage name="stock" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6'>
                            <FormCheck 
                                type="checkbox"
                                name="isVariationProduct"
                                label="Is Variation Product"
                                className='text-light my-auto d-block'
                                checked={values.isVariationProduct} 
                                onChange={e => {
                                    setFieldValue("isVariationProduct", e.target.checked); 
                                }}
                                isInvalid={!!(errors.isVariationProduct && touched.isVariationProduct)}
                            />
                            <ErrorMessage name="isVariationProduct" component="div" className="invalid-feedback" />
                        </FormGroup>
                        {values.isVariationProduct && 
                            <FormGroup className='col-12 col-md-6'>
                                <FormLabel htmlFor="variationType">Variation Type</FormLabel>
                                <Field
                                    name="variationType"
                                    as="select"
                                    placeholder="Color / Size"
                                    className={`form-control ${errors.variationType && touched.variationType ? 'is-invalid' : ''}`}
                                >
                                    <option value={''} disabled>Select ...</option>
                                    <option value={'SIZE'}>Size</option>
                                    <option value={'COLOR'}>Color</option>
                                </Field>
                                <ErrorMessage name="variationType" component="div" className="invalid-feedback" />
                            </FormGroup>
                        }

                        <FormGroup className='col-12 col-md-6 mb-2'>
                            <FormLabel htmlFor="images">Product Gallery</FormLabel>
                            <input
                                multiple
                                type='file'
                                name='images'
                                id='images'
                                className={`form-control ${errors.images && touched.images ? 'is-invalid' : ''}`}
                                onChange={e => {
                                    const files = Array.from(e.target.files);
                                    setFieldValue('images', files);
                                }}
                            />
                            <small className='text-light'>Max 10 images of 1MB are allowed.</small> 
                            <ErrorMessage name="images" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <div className='col-12 my-2 my-md-4'>
                            <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                                {id === '' ? 'Create New Product' : 'Update Product'}
                            </Button>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );
};

const ProductVariationForm = ({ id, productID, handleConfirmation }) => {
    const { defaultValue, handleFormSubmisstion } = useProductVariationForm(id, productID);

    async function handleProcessedFormData(values, imageArrayKeys) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (imageArrayKeys.includes(key) && Array.isArray(value)) {
                value.forEach((image, index) => {
                    if (image instanceof Blob) {
                        formData.append(key, image);
                    }
                });
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null) {
                formData.append(key, String(value));
            }
        });
    
        return formData;
    }

    return (
        <Formik
            initialValues={defaultValue}
            enableReinitialize
            validationSchema={VALIDATION.productVariationFormValidation}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    const processedData = await handleProcessedFormData(values, ['images'])
                    await handleFormSubmisstion(processedData, handleConfirmation)
                } catch (err) {
                    console.log(err);
                    FireToast({ title: 'Error', subTitle: err.response?.data?.message || 'Variation Creation failed' });
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, dirty, isValid, values, setFieldValue }) => {  
                // console.log(errors) 
                return (
                    <Form className='row rounded border shadow-lg p-4 m-2'>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="variationType">Variation Name</FormLabel>
                            <Field
                                name="variationType"
                                type="text"
                                placeholder='red'
                                as={FormControl}
                                isInvalid={!!(errors.variationType && touched.variationType)}
                            />
                            <ErrorMessage name="variationType" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6'>
                            <FormLabel htmlFor="sku">Variation SKU</FormLabel>
                            <Field
                                name="sku"
                                type="text"
                                placeholder='AT-ER-01'
                                as={FormControl}
                                isInvalid={!!(errors.sku && touched.sku)}
                            />
                            <ErrorMessage name="sku" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 col-md-4'>
                            <FormLabel htmlFor="mrpPrice">Variation MRP</FormLabel>
                            <Field
                                name="mrpPrice"
                                type="number"
                                placeholder="100"
                                min={0}
                                as={FormControl}
                                step={0.1}
                                isInvalid={!!(errors.mrpPrice && touched.mrpPrice)}
                            />
                            <ErrorMessage name="mrpPrice" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 col-md-4'>
                            <FormLabel htmlFor="sellingPrice">Variation Selling Price</FormLabel>
                            <Field
                                name="sellingPrice"
                                type="number"
                                placeholder="100"
                                min={0}
                                max={values.mrpPrice}
                                as={FormControl}
                                step={0.1}
                                onChange={(e) => {
                                    const {value}  = e.target;
                                    if(value > values.mrpPrice){
                                        setFieldValue('sellingPrice', values.mrpPrice)
                                    } else {
                                        setFieldValue('sellingPrice', value)
                                    }
                                    
                                }}
                                isInvalid={!!(errors.sellingPrice && touched.sellingPrice)}
                            />
                            <ErrorMessage name="sellingPrice" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 col-md-4'>
                            <FormLabel htmlFor="stock">Variation Stock</FormLabel>
                            <Field
                                name="stock"
                                type="number"
                                placeholder="100"
                                min={0}
                                as={FormControl}
                                isInvalid={!!(errors.stock && touched.stock)}
                            />
                            <ErrorMessage name="stock" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup className='col-12 col-md-6 mb-2'>
                            <FormLabel htmlFor="images">Variation Images</FormLabel>
                            <input
                                multiple
                                type='file'
                                name='images'
                                id='images'
                                className={`form-control ${errors.images && touched.images ? 'is-invalid' : ''}`}
                                onChange={e => {
                                    const files = Array.from(e.target.files);
                                    setFieldValue('images', files);
                                }}
                            />
                            <small className='text-light'>Max 10 images of 1MB are allowed.</small> 
                            <ErrorMessage name="images" component="div" className="invalid-feedback" />
                        </FormGroup>

                        <div className='col-12 my-2 my-md-4'>
                            <Button type="submit" variant="primary" className='mx-auto d-block' disabled={!(dirty && isValid)}>
                                {id === '' ? 'Create New Variation' : 'Update Variation'}
                            </Button>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );
};

const PRODUCT_FORM = {ProductForm, ProductVariationForm}

export default PRODUCT_FORM