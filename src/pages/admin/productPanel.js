import React from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { CiViewList } from "react-icons/ci";
import { FaEdit, FaEye, FaTrashAlt, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import PRODUCT_FORM from '../../component/forms/admin/product';
import ModalWrapper from '../../component/modalWrapper';
import useProduct from '../../hooks/admin/useProduct';

const ProductPanel = () => {
    const { filteredList, searchText, ddownToggle, modalToggle, modalData, setModalToggle, setModalData, setSearchText, setDDownToggle, handleProductNavigation, handleProductDeletion, handleConfirmation, handleProductVariationDeletion, handleProductStatusUpdate, handleVariationStatusUpdate } = useProduct();
   

    function handleModalToggle(id, mode, title, variID){
        setModalData({ id, mode, title, variID });
        setModalToggle(true)
    }
    return (
            <>
                <div className='d-flex justify-content-between gap-2 align-items-center my-2 mt-md-4'>
                    <h2 className='text-light'>Product Panel</h2>
                    <Button type='button' className='w-auto' onClick={() => handleModalToggle('', 'Single', 'Add New Product', '')}>Add New Product</Button>
                </div>
                <div className='my-2 my-md-4 d-flex gap-2 align-items-center justify-content-between'>
                    <input type='text' name='searchProduct' id='searchProduct' placeholder='Search Product by Name' className='form-control rounded-2' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </div>
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product SKU</th>
                            <th>Product Name</th>
                            <th className='text-center'>Product Category</th>
                            <th className='text-center'>Product Type</th>
                            <th className='text-center'>Variation Type</th>
                            <th className='text-center'>Product MRP</th>
                            <th className='text-center'>Available Quanity</th>
                            <th className='text-center'>Interact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList?.length > 0 ? filteredList.map((product, index) => (
                            <React.Fragment key={product._id}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{product.baseSku}</td>
                                    <td>{product.name}</td>
                                    <td className='text-center'>{product.categoryId.name}</td>
                                    <td className='text-center'>{product.isVariationProduct ? 'Variation' : 'Single'}</td>
                                    <td className='text-center'>{product.variationName}</td>
                                    <td className='text-center'><small className='text-decoration-line-through me-2'>₹ {product.baseMRPPrice}/-</small> ₹ {product.baseSellingPrice}/-</td>
                                    <td className='text-center'>{product.baseStock} {product.baseStock?.length > 0 ? 'PCs' : 'PC'}</td>
                                    <td>
                                        <div className="d-flex gap-2 w-100 justify-content-center align-items-center">
                                            <OverlayTrigger
                                                placement="top"
                                                className='h-auto'
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={(props) => (
                                                    <Tooltip id="View-Product" {...props}>
                                                        View Product
                                                    </Tooltip>
                                                )}
                                            >
                                                <Button variant="primary" onClick={() => handleProductNavigation(product.id)}>
                                                    <FaEye />
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                className='h-auto'
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={(props) => (
                                                    <Tooltip id="Edit Product" {...props}>
                                                        Edit Product
                                                    </Tooltip>
                                                )}
                                            >
                                                <Button variant="warning" onClick={() =>  handleModalToggle(product._id, 'Single', "Edit Product's Details", '')}>
                                                    <FaEdit />
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                className='h-auto'
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={(props) => (
                                                    <Tooltip id="Inactive-Service" {...props}>
                                                        {product.isAvailable ? 'Inactivate Product' : 'Activate Product'}
                                                    </Tooltip>
                                                )}
                                            >
                                                <Button onClick={() => handleProductStatusUpdate(product._id, !product.isAvailable)}>
                                                    {product.isAvailable ? <FaUserCheck /> : <FaUserSlash /> }
                                                </Button>
                                            </OverlayTrigger>
                                            {product.isVariationProduct && 
                                                <OverlayTrigger
                                                    placement="top"
                                                    className='h-auto'
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={(props) => (
                                                        <Tooltip id="View Variations" {...props}>
                                                            View Variations
                                                        </Tooltip>
                                                    )}
                                                >
                                                    <Button  onClick={() => setDDownToggle(prev =>  ({...prev, [product._id]: !prev[product._id]}))}>
                                                        <CiViewList />
                                                    </Button>
                                                </OverlayTrigger>
                                            }
                                            <OverlayTrigger
                                                placement="top"
                                                className='h-auto'
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={(props) => (
                                                    <Tooltip id="Delete-Product" {...props}>
                                                        Delete Product
                                                    </Tooltip>
                                                )}
                                            >
                                                <Button variant="danger" type='button' onClick={() => handleProductDeletion(product._id)}>
                                                    <FaTrashAlt />
                                                </Button>
                                            </OverlayTrigger>
                                        </div>
                                    </td>
                                </tr>
                                {ddownToggle[product._id] && 
                                    <tr>
                                        <td colSpan={9}>
                                            <ProductVariations 
                                                variationList={product.variations} 
                                                handleDeletion={(id) => handleProductVariationDeletion(product._id, id)} 
                                                handleVariationForm={(id) => handleModalToggle(id, 'Variation', id === '' ? "Add New Variation" : 'Edit Product Variation', product._id)}  
                                                handleStatusUpdate={(id, value) => handleVariationStatusUpdate(product._id, id, value)}
                                            />
                                        </td>
                                    </tr> 
                                }
                            </React.Fragment>
                        )) : <tr><td colSpan={9}>No Product found</td></tr>}
                    </tbody>
                </Table>
                {modalToggle ? 
                    <ModalWrapper title={modalData.title} toggle={modalToggle} setToggle={setModalToggle} size={'lg'} >
                        {modalData.mode === 'Single' 
                            ? <PRODUCT_FORM.ProductForm id={modalData.id} handleConfirmation={handleConfirmation} />
                            : <PRODUCT_FORM.ProductVariationForm id={modalData.id} productID={modalData.variID} handleConfirmation={handleConfirmation} />
                        }
                    </ModalWrapper >
                : <></>}
            </>
    )
}

const ProductVariations = ({variationList, handleDeletion, handleVariationForm, handleStatusUpdate}) => {
    return (
        <div>
            <Button type='button' onClick={() => handleVariationForm('')} className='d-block ms-auto my-2'>Add New Variation</Button>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th colSpan={1}>#</th>
                        <th colSpan={1}>Variation SKU</th>
                        <th colSpan={1}>Variation Type</th>
                        <th colSpan={1}>Variation Price</th>
                        <th colSpan={1}>Variation Quanity</th>
                        <th colSpan={1} className='text-center'>Interact</th>
                    </tr>
                </thead>
                <tbody>
                    {variationList?.length > 0 ? variationList.map((item, index) => (
                        <tr key={item._id}>
                            <td colSpan={1}>{index + 1}</td>
                            <td colSpan={1}>{item.sku}</td>
                            <td colSpan={1}>{item.value}</td>
                            <td colSpan={1}><small className='text-decoration-line-through me-2'>₹ {item.mrpPrice}/-</small>₹ {item.sellingPrice}/-</td>
                            <td colSpan={1}>{item.stock} {item.stock?.length > 0 ? "PCs" : 'PC'}</td>
                            
                            <td colSpan={1}>
                                <div className="d-flex gap-2 w-100 justify-content-center align-items-center">
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="Edit Variation" {...props}>
                                                Edit Variation
                                            </Tooltip>
                                        )}
                                    >
                                        <Button variant="warning" onClick={() =>  handleVariationForm(item._id)}>
                                            <FaEdit />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="Inactive-Service" {...props}>
                                                {item.isAvailable ? 'Inactivate Variation' : 'Activate Variation'}
                                            </Tooltip>
                                        )}
                                    >
                                        <Button onClick={() => handleStatusUpdate(item._id, !item.isAvailable)}>
                                            {item.isAvailable ? <FaUserCheck /> : <FaUserSlash /> }
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        className='h-auto'
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={(props) => (
                                            <Tooltip id="Delete-Variation" {...props}>
                                                Delete Variation
                                            </Tooltip>
                                        )}
                                    >
                                        <Button variant="danger" type='button' onClick={() => handleDeletion(item._id)}>
                                            <FaTrashAlt />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={6}>No Variation found</td></tr>}
                </tbody>
            </Table>
        </div>
    )
}

export default ProductPanel