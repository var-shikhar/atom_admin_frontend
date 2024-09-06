import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
    return (
        <div className='text-light d-flex align-items-center justify-content-center gap-2 flex-column my-2 my-md-4'>
            <div>You're not authenticated, Login to access the portal!</div>
            <Button type='button' className='w-auto' onClick={() => navigate(`../login`)}>Proceed to Login</Button>         
        </div>
    )
}

export default Home


