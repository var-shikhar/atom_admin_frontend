import React, { useState } from 'react';
import { Button, Card, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { FaEdit, FaEye, FaEyeSlash, FaTrashAlt } from 'react-icons/fa';
import SettingForms from '../../component/forms/admin/setting';
import ModalWrapper from '../../component/modalWrapper';
import useSettingPanel from '../../hooks/admin/useSetting';


const SettingPanel = () => {
  const { handleDeleteItem, handleRefreshTkn, handleItemStatus, settingList } = useSettingPanel();
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [modalToggle, setModalToggle] = useState(false);
  const [modalData, setModalData] = useState({
    itemID: '',
    title: '',
    mode: '',
  })

  function handleForm({id, mode, title}){
    setModalToggle(!modalToggle)
    setModalData({itemID: id, mode: mode, title: title})
  }

  
  return (
    <>
      <div className='container h-100 text-light'>
        <div className='fs-2 fw-bold text-center my-2'>Setting Overview</div>
        <small className='d-block text-center text-light-2'>Add/Update panel settings at one page.</small>
        <hr />
        <div className='row h-auto py-2'>
          <div className='col-12 col-md-3 d-none d-md-block'>
            <div className='border-light rounded p-2 d-flex flex-column gap-2 h-100'>
              {settingList?.map((item, index) => 
                <div key={item.id} className={`${index === activeNavIndex ? 'text-body-background bg-white shadow' : 'text-light'} fw-bold rounded-2 p-2 px-md-4 cursor-pointer`} onClick={() => setActiveNavIndex(index)}>
                  {item.navName}
                </div>
              )}
            </div>
          </div>
          <div className='col-12 col-md-9'>
            <Card>
              <Card.Header as="h5" className='bg-body-background text-light'>
                <div className='d-flex align-items-center justify-content-between'>
                  {settingList[activeNavIndex].cardTitle}
                  <Button type='button' className='w-auto' onClick={() => handleForm({
                    id: '', 
                    mode: settingList[activeNavIndex].button.buttonSlug, 
                    title: `Add New ${settingList[activeNavIndex].button.buttonSlug}`
                  })}>
                    {settingList[activeNavIndex].button.title}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                      <tr className='rounded'>
                        {settingList[activeNavIndex].tableHeading?.map(item => (
                            <th key={item.id} className='w-auto max-content' colSpan={item.colSpan}>{item.title}</th>
                        ))}
                        <th>Interact</th>
                      </tr>
                  </thead>
                  <tbody className='h-100 overflow-y-scroll'>
                    {settingList[activeNavIndex].tableData?.map((item, index) => {
                      const slugName = settingList[activeNavIndex].button.buttonSlug;
                      return (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td colSpan={1}>{item?.name}</td>
                          {activeNavIndex === 1 && <td colSpan={1}>{item?.categoryId?.name}</td> }
                          <td colSpan={2} className='truncate-2-lines h-auto border-0'>{item?.description}</td>
                          <td colSpan={1}>
                            <div className='d-flex align-items-center gap-2'>
                              <OverlayTrigger
                                placement="top"
                                className='h-auto'
                                delay={{ show: 250, hide: 400 }}
                                overlay={(props) => (
                                    <Tooltip id={`EDIT ${slugName}`} {...props}>
                                        EDIT {slugName.toUpperCase()}
                                    </Tooltip>
                                )}
                              >
                                <Button variant="warning" onClick={() => { 
                                  handleForm({
                                    id: item._id, 
                                    mode: slugName, 
                                    title: `Edit ${slugName}`
                                  })
                                }}>
                                  <FaEdit />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                className='h-auto'
                                delay={{ show: 250, hide: 400 }}
                                overlay={(props) => (
                                    <Tooltip id={`EDIT ${slugName}`} {...props}>
                                      {item?.isActive ? 'Enable' : 'Disable'} {slugName}
                                    </Tooltip>
                                )}
                              >
                                <Button variant="warning" onClick={() => handleItemStatus(item._id, slugName, !item?.isActive)}>
                                  {item?.isActive ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                  placement="top"
                                  className='h-auto'
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={(props) => (
                                      <Tooltip id={`Delete ${slugName.toUpperCase}`} {...props}>
                                          Delete {slugName.toUpperCase()}
                                      </Tooltip>
                                  )}
                              >
                                  <Button variant="danger" type='button' onClick={() => handleDeleteItem(item._id, slugName)}>
                                      <FaTrashAlt />
                                  </Button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {modalToggle && (
        <ModalWrapper toggle={modalToggle} setToggle={setModalToggle} title={modalData.title.toLocaleUpperCase()} size='md'>
          {modalData.mode === settingList[0].button.buttonSlug ? 
            <SettingForms.CategoryForm id={modalData.itemID} handleConfirmation={() => {setModalToggle(false); handleRefreshTkn({category: true, subCategory: false})}} /> : 
            <SettingForms.SubCategoryForm id={modalData.itemID} handleConfirmation={() => {setModalToggle(false); handleRefreshTkn({category: false, subCategory: true})}} />
          }
        </ModalWrapper>
      )}

    </>
  );
}
export default SettingPanel