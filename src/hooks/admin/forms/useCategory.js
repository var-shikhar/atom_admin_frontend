import { startTransition, useEffect, useState } from 'react';
import useAxioRequests from '../../../function/axioRequest';
import ROUTES from '../../../util/routes';

const useCategoryForm = ( id = '' ) => {
    const [loading, setLoading] = useState(true);
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests();

    const [defaultValue, setDefaultValues] = useState({
        id: '', 
        name: '', 
        description: 'NA',
    });


    useEffect(() => {
        if (loading && id !== '') handleGetRequest(`${ROUTES.commonCategoryRoute}/${id}`)
    }, [loading, id])

    async function handleGetRequest(route) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(false)
                setDefaultValues(prev => ({...response.data}))
            })

        }
    }

    async function handleFormSubmisstion(values, handleConfirmation){
        const response = await HandlePostRequest({
            route: ROUTES.commonCategoryRoute,
            type: id === '' ? 'post' : 'put',
            data: values,
            toastDescription: `Category has created successfully`
        });
        if (response?.status === 200) handleConfirmation();
    }

    return{
        defaultValue,
        handleFormSubmisstion,
    }
}

export default useCategoryForm