import { startTransition, useEffect, useState } from 'react';
import useAxioRequests from '../../../function/axioRequest';
import ROUTES from '../../../util/routes';

const useProductForm = ( id = '' ) => {
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests()
    const [loading, setLoading] = useState({
        category: true,
        subCategory: true,
        initial: true,
    });

    const [apiData, setAPIData] = useState({
        categoryList: [],
        subCategoryList: [],
        filteredSubCategoryList: [],
    })

    const [defaultValue, setDefaultValues] = useState({
        id: '', 
        name: '', 
        description: 'NA',
        categoryID: '',
        subCategoryID: '',
        mrpPrice: 0,
        sellingPrice: 0,
        stock: 0,
        sku: '',
        isVariationProduct: false,
        variationType: '',
        images: [],
        isEdit: id !== ''
    });


    useEffect(() => {
        loading.category && handleGetRequest(ROUTES.commonCategoryRoute, 'category')
        loading.subCategory && handleGetRequest(ROUTES.commonSubCategoryRoute, 'subCategory')
        if(loading.initial && id !== '') handleGetRequest(`${ROUTES.commonProductRoute}/${id}`, 'initial')
    }, [loading.category, loading.subCategory, loading.initial, id]);


    // Handle Get Requests
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                mode === 'category'
                ? setAPIData(prev => ({...prev, categoryList: response.data}))
                : mode === 'subCategory'
                ?  setAPIData(prev => ({...prev, subCategoryList: response.data}))
                : setDefaultValues(prev => ({...prev, ...response.data}))
            })

            if(mode === 'initial') handleCategorySwitching(response.data.categoryID)
        }
    }

    // Handle Form Submission
    async function handleFormSubmisstion(values, handleConfirmation){
        for(let [key, value] of values.entries()){
            console.log(key, value)
        }

        const response = await HandlePostRequest({
            route: ROUTES.commonProductRoute,
            type: id === '' ? 'post' : 'put',
            data: values,
            toastDescription: `Product has ${id === '' ? 'created' : 'updated'} successfully!`
        });
        if (response?.status === 200) handleConfirmation();
    }

    // Handle Sub-Category Filter
    function handleCategorySwitching(value){
        const tempCategory = apiData.subCategoryList?.filter(item => item.categoryId._id.toString() === value.toString());

        startTransition(() => {
            setAPIData(prev => ({...prev, filteredSubCategoryList: tempCategory}))
        })
    }

    return{
        defaultValue,
        apiData, 
        handleFormSubmisstion,
        handleCategorySwitching,
    }
}

export default useProductForm