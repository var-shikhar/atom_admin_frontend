import React, { startTransition, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { CiViewList } from "react-icons/ci";
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { GrTransaction } from "react-icons/gr";
import { HiCurrencyRupee } from "react-icons/hi";
import { RiPresentationFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import DocumentForm from '../component/forms/documentForm';
import ImpressForm from '../component/forms/impressForm';
import MemberForm from '../component/forms/memberForm';
import ModalWrapper from '../component/modalWrapper';
import useMemberList from '../hooks/useMemberList';
import useTransaction from '../hooks/useTransaction';
import { ListGroup } from 'react-bootstrap';

const CatgoryPanel = () => {
    const {memberList, handleMemberDeletion, handleFormDeletion} = useMemberList();

    const navigate = useNavigate();
    const [filteredList, setFilteredList] = useState(memberList);
    const [ddownToggle, setDDownToggle] = useState({});

    const [searchFilter, setSearchFilter] = useState('')
    const [modalToggle, setModalToggle] = useState(false);
    const [modalData, setModalData] = useState({
        show: false,
        title: 'Add New Employee',
        id: '',
        type: 'form',
        grantedImpress: 0
    })

    useEffect(() => {
        if (memberList?.length > 0) {
            let tempList = memberList;
            if (searchFilter !== '') {
                tempList = tempList.filter(member => member.name.toLowerCase().includes(searchFilter.toLowerCase()))
            }

            setFilteredList(tempList)
        }
    }, [memberList, searchFilter])

    useEffect(() => {
        if(memberList?.length > 0){
            let tempDDown = {};
            memberList.forEach(item => {
                tempDDown[item.id] = false;
            })

            startTransition(() => {
                setDDownToggle(tempDDown)
            })
        }
    }, [memberList])


    function handleModalForm(showDetail, modalTitle, id, type, impressAmount = 0) {
        setModalData({ show: showDetail, title: modalTitle, id: id, type: type, grantedImpress: impressAmount }); 
        setModalToggle(true)
    }

    function handleConfirmation(){
        window.location.reload();
        setModalToggle(!modalToggle);
    }

    return (
        <>
            <div className='d-flex justify-content-between gap-2 align-items-center my-2 mt-md-4'>
                <h2 className='text-light'>Category Panel</h2>
                <Button type='button' className='w-auto' onClick={() => handleModalForm('', 'Add New Category')}>Add New Category</Button>
            </div>
            <div className='my-2 my-md-4 d-flex gap-2 align-items-center justify-content-between'>
                <input type='text' name='searchUser' id='searchUser' placeholder='Search Category by Name' className='form-control rounded-2' value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
            </div>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Employee Name</th>
                        <th className='text-center'>Employee Role</th>
                        <th className='text-center'>Employee Email</th>
                        <th className='text-center'>Employee Phone</th>
                        <th className='text-center'>Given Impress</th>
                        <th className='text-center'>Interact</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList?.length > 0 ? filteredList.map((member, index) => (
                        <React.Fragment key={member.id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{member.name}</td>
                                <td className='text-center'>{member.post}</td>
                                <td className='text-center'>{member.email}</td>
                                <td className='text-center'>{member.phone}</td>
                                <td className='text-center'>{member.grantedImpress}</td>
                                <td>
                                    <div className="d-flex gap-2 w-100 justify-content-center align-items-center">
                                        <OverlayTrigger
                                            placement="top"
                                            className='h-auto'
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => (
                                                <Tooltip id="button-tooltip" {...props}>
                                                    View Details
                                                </Tooltip>
                                            )}
                                        >
                                            <Button variant="primary" onClick={() => handleModalForm(true, "View Employee's Details", member.id, 'form')}>
                                                <FaEye />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            className='h-auto'
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => (
                                                <Tooltip id="Edit Employee" {...props}>
                                                    Edit Employee
                                                </Tooltip>
                                            )}
                                        >
                                            <Button variant="warning" onClick={() =>  handleModalForm(false, "Edit Employee's Details", member.id, 'form')}>
                                                <FaEdit />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            className='h-auto'
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => (
                                                <Tooltip id="View Documents" {...props}>
                                                    View Documents
                                                </Tooltip>
                                            )}
                                        >
                                            <Button  onClick={() => setDDownToggle(prev => ({...prev, [member.id]: !prev[member.id]}))}>
                                                <CiViewList />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            className='h-auto'
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => (
                                                <Tooltip id="View Attendance" {...props}>
                                                    View Attendance
                                                </Tooltip>
                                            )}
                                        >
                                            <Button  onClick={() => navigate(`../attendance/${member.id}`)}>
                                                <RiPresentationFill />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            className='h-auto'
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => (
                                                <Tooltip id="Impress-Form" {...props}>
                                                    Impress Form
                                                </Tooltip>
                                            )}
                                        >
                                            <Button  onClick={() => handleModalForm(false, "Impress Form", member.id, 'impress', member.grantedImpress)}>
                                                <HiCurrencyRupee />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            className='h-auto'
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => (
                                                <Tooltip id="Transaction-List" {...props}>
                                                    Transaction List
                                                </Tooltip>
                                            )}
                                        >
                                            <Button  onClick={() => handleModalForm(false, "Transaction List", member.id, 'transaction')}>
                                                <GrTransaction />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            className='h-auto'
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={(props) => (
                                                <Tooltip id="Delete-Employee" {...props}>
                                                    Delete Employee
                                                </Tooltip>
                                            )}
                                        >
                                            <Button variant="danger" type='button' onClick={() => handleMemberDeletion(member.id)}>
                                                <FaTrashAlt />
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </td>
                            </tr>
                            {ddownToggle[member.id] && <tr><td colSpan={7}><UserDocument docList={member.docList} handleDeletion={(id) => handleFormDeletion(id, member.id)} handleAddDocument={() => handleModalForm(false, "Add New Document", member.id, 'document')}  /></td></tr> }
                        </React.Fragment>
                    )) : <tr><td>No Employee found</td></tr>}
                </tbody>
            </Table>
            {modalToggle ? 
                <ModalWrapper title={modalData.title} toggle={modalToggle} setToggle={setModalToggle} size={modalData.type === 'impress' ? 'sm' : modalData.type ===  'transaction' ? 'md' : 'lg'} >
                    {modalData.type === 'form' 
                        ? <MemberForm id={modalData.id} showDetails={modalData.show} handleConfirmation={handleConfirmation} />
                        : modalData.type === 'impress' 
                        ? <ImpressForm id={modalData.id} handleConfirmation={handleConfirmation} grantedImpress={modalData.grantedImpress} />
                        : modalData.type === 'transaction'
                        ? <TransactionList userID={modalData.id} />
                        : <DocumentForm id={modalData.id} handleConfirmation={handleConfirmation} />
                    }
                </ModalWrapper >
            : <></>}
        </>
    ); 
}; 


export default CatgoryPanel;
