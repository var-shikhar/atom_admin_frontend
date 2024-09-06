import * as Yup from 'yup';

const loginFormValidation = Yup.object().shape({
    userEmail: Yup.string()
    .email('Invalid Email Address')
    .required('Password is required'),
    userPassword: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number',
        ),
});

const categoryFormValidation = Yup.object().shape({
    name: Yup.string().min(3, 'Min 3 Characters are required!').max(100, 'Max 100 Characters are allowed!').required('Required Field!'),
    description: Yup.string().min(2, 'Min 2 Characters are required!').max(500, 'Max 500 Characters are allowed!').optional(),
});

const subCategoryFormValidation = Yup.object().shape({
    name: Yup.string().min(3, 'Min 3 Characters are required!').max(100, 'Max 100 Characters are allowed!').required('Required Field!'),
    description: Yup.string().min(2, 'Min 2 Characters are required!').max(500, 'Max 500 Characters are allowed!').optional(),
    categoryID:  Yup.string().notOneOf([''], 'Please select an valid option!').required('Required Field!'),
});

const productFormValidation = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Min 3 Characters are required!')
        .max(100, 'Max 100 Characters are allowed!')
        .required('Required Field!'),
    description: Yup.string()
        .min(2, 'Min 2 Characters are required!')
        .max(500, 'Max 500 Characters are allowed!')
        .required('Required Field!'),
    categoryID: Yup.string()
        .notOneOf([''], 'Please select a valid option!')
        .required('Required Field!'),
    subCategoryID: Yup.string()
        .notOneOf([''], 'Please select a valid option!')
        .required('Required Field!'),
    mrpPrice: Yup.number()
        .positive('Must be a positive number')
        .required('Required Field!'),
    sellingPrice: Yup.number()
        .positive('Must be a positive number')
        .required('Required Field!'),
    stock: Yup.number()
        .min(0, 'Stock must be at least 0')
        .required('Required Field!'),
    sku: Yup.string()
        .min(3, 'Min 3 Characters are required!')
        .max(20, 'Max 20 Characters are allowed!')
        .required('Required Field!'),
    isVariationProduct: Yup.boolean().optional(),
    variationType: Yup.string().test('is-requied', 'Required Field!',  function(value) {
        const {isVariationProduct} = this.parent;
        if (!isVariationProduct) return true;
        return !!value
    }),
    images: Yup.array()
        .of(
            Yup.mixed()
                .test('fileSize', 'File size too large, Max limit is 1MB', function (value) {
                    const { isEdit } = this.parent;
                    if (isEdit) return true; // Skip validation in edit mode
                    if (!value) return this.createError({ message: 'Required Field!' });
                    return value.size <= 1048576; // 1MB size limit
                })
                .test('fileType', 'Invalid file type. Only PNG, JPG, and WEBP allowed', function (value) {
                    const { isEdit } = this.parent;
                    if (isEdit) return true; // Skip validation in edit mode
                    if (!value) return this.createError({ message: 'Required Field!' });
                    return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
                })
                .nullable()
        )
        .nullable(),
});

const productVariationFormValidation = Yup.object().shape({
    mrpPrice: Yup.number()
        .positive('Must be a positive number')
        .required('Required Field!'),
    sellingPrice: Yup.number()
        .positive('Must be a positive number')
        .required('Required Field!'),
    stock: Yup.number()
        .min(0, 'Stock must be at least 0')
        .required('Required Field!'),
    sku: Yup.string()
        .min(3, 'Min 3 Characters are required!')
        .max(20, 'Max 20 Characters are allowed!')
        .required('Required Field!'),
    variationType: Yup.string()
        .min(2, 'Min 2 Characters are required!')
        .max(20, 'Max 20 Characters are allowed!')
        .required('Required Field!'),
    images: Yup.array()
        .of(
            Yup.mixed()
                .test('fileSize', 'File size too large, Max limit is 1MB', function (value) {
                    if (!value) return this.createError({ message: 'Required Field!' });
                    return value.size <= 1048576; // 1MB size limit
                })
                .test('fileType', 'Invalid file type. Only PNG, JPG, and WEBP allowed', function (value) {
                    if (!value) return this.createError({ message: 'Required Field!' });
                    return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
                })
                .nullable()
        )
        .nullable(),
});


const VALIDATION = {
    loginFormValidation, 
    categoryFormValidation, subCategoryFormValidation, 
    productFormValidation, productVariationFormValidation,
}

export default VALIDATION;