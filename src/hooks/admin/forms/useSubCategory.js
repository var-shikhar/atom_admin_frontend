import { startTransition, useEffect, useState } from 'react';
import useAxioRequests from '../../../function/axioRequest';
import ROUTES from '../../../util/routes';

const useSubCategoryForm = ( id = '' ) => {
    const { HandleGetRequest, HandlePostRequest } = useAxioRequests();
    const [loading, setLoading] = useState({
        list: true,
        initial: true
    });

    const [categoryList, setCategoryList] = useState([])
    const [defaultValue, setDefaultValues] = useState({
        id: '', 
        name: '', 
        description: 'NA',
        categoryID: '',
    });


    useEffect(() => {
        if (loading.initial && id !== '') handleGetRequest(`${ROUTES.commonSubCategoryRoute}/${id}`, 'initial')
        loading.list && handleGetRequest(ROUTES.commonCategoryRoute, 'list')
    }, [loading.initial, loading.list, id])

    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}));
                mode === 'initial' 
                    ? setDefaultValues(prev => ({...response.data}))
                    : setCategoryList(response.data)
            })

        }
    }

    async function handleFormSubmisstion(values, handleConfirmation){
        const response = await HandlePostRequest({
            route: ROUTES.commonSubCategoryRoute,
            type: id === '' ? 'post' : 'put',
            data: values,
            toastDescription: `Category has created successfully`
        });
        if (response?.status === 200) handleConfirmation();
    }

    return{
        categoryList,
        defaultValue,
        handleFormSubmisstion,
    }
}

export default useSubCategoryForm