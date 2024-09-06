import { startTransition, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import useAxioRequests from '../../function/axioRequest';
import ROUTES from '../../util/routes';

const subCategoryTableHeading = [
    {
        id: 1,
        title: 'S. No.',
        colSpan: 1,
    },
    {
        id: 2,
        title: 'Sub Category Name',
        colSpan: 1,
    },
    {
        id: 3,
        title: 'Category Name',
        colSpan: 1,
    },
    {
        id: 4,
        title: 'Sub-Category Description',
        colSpan: 1,
    },
]
const categoryTableHeading = [
    {
        id: 1,
        title: 'S. No.',
        colSpan: 1,
    },
    {
        id: 2,
        title: 'Category Name',
        colSpan: 1,
    },
    {
        id: 3,
        title: 'Category Description',
        colSpan: 1,
    },
]

const useSettingPanel = () => {
    const navigate = useNavigate()
    const {HandleGetRequest, HandlePostRequest} = useAxioRequests()
    const {userID} = useAuthContext();
    const [loading, setLoading] = useState({
        category: true, 
        subCategory: true,
    });
    
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);

    const settingList = [
        {
            id: 1,
            navName: 'Product Category',
            slug: 'category',
            cardTitle: 'Category List',
            button: {
                title: 'Add New Category',
                buttonSlug: 'category'
            },
            tableHeading: categoryTableHeading,
            tableData: categoryList,
        },
        {
            id: 2,
            navName: 'Product Sub-Category',
            slug: 'subCategory',
            cardTitle: 'Sub-Category List',
            button: {
                title: 'Add New Sub-Category',
                buttonSlug: 'subCategory'
            },
            tableHeading: subCategoryTableHeading,
            tableData: subCategoryList,
        },
    ]

    useLayoutEffect(() => {
        if(userID === '' || userID === undefined){
            navigate('../login')
        }
    }, [userID])

    useEffect(() => {
        if(userID !== ''){
            loading.category && handleGetRequest(ROUTES.commonCategoryRoute, 'category')
            loading.subCategory && handleGetRequest(ROUTES.commonSubCategoryRoute, 'subCategory')        
        }
    }, [loading.category, loading.subCategory, userID])
 
    // Fetch Lists from Server
    async function handleGetRequest(route, mode) {
        const response = await HandleGetRequest(route);
        if (response?.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: false}))
                mode === 'category' ? setCategoryList(response.data) : setSubCategoryList(response.data)
            })
        }
    }

    // Handle Refresh List
    function handleRefreshTkn({category = false, subCategory = false }){
        startTransition(() => {
            setLoading({category: category, subCategory: subCategory});
        })
    }

    // Delete Item 
    async function handleDeleteItem(id, mode) {
        const route = mode === 'category' ? ROUTES.commonCategoryRoute : ROUTES.commonSubCategoryRoute;
        const response = await HandlePostRequest({
            route: `${route}/${id}`,
            type: 'delete',
            toastDescription: `${mode} has been deleted successfully`,
            data: { id: id }
        });
        if (response.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: true}));
            })
        }
    }

    // Active/InActive Category 
    async function handleItemStatus(id, mode, value) {
        const route = mode === 'category' ? ROUTES.commonCategoryRoute : ROUTES.commonSubCategoryRoute;
        const response = await HandlePostRequest({
            route: `${route}/${id}`,
            type: 'put',
            toastDescription: `${mode} has been ${value ? 'enabled' : 'disabled'} successfully!`,
            data: { categoryID: id, value: value}
        });
        if (response.status === 200) {
            startTransition(() => {
                setLoading(prev => ({...prev, [mode]: true}));
            })
        }
    }
    
    return {
        settingList,
        handleRefreshTkn,
        handleDeleteItem,
        handleItemStatus,
    }
}

export default useSettingPanel