import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import { useAuthContext } from './context/authContext';
import useAxioRequests from './function/axioRequest';
import Home from './pages/home';
import Login from './pages/login';
import ContentRoute from './routes/contentRoutes';
import ROUTES from './util/routes';

const App = () => {
  const { userID } = useAuthContext();
  const { defaultRoutes } = ContentRoute();
  const { HandleGetRequest } = useAxioRequests()

  const handleLogout = async () => {
    try {
      const response = await HandleGetRequest(ROUTES.logoutRoute);
      if (response.status === 200) {
        window.location.href = '/login';
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Router>
      <div className='vh-100 d-flex flex-column'>
        <nav className="navbar navbar-expand-lg px-2 px-md-5 border border-light">
          <Link to="/" className="navbar-brand text-light fs-4">Home</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              {defaultRoutes !== null && defaultRoutes?.length > 0 && defaultRoutes?.map(nav => {
                if(nav.isActiveRoute){
                  return (
                    <li className="nav-item" key={nav.id}>
                      <Link to={`/${nav.route}`} className="nav-link text-light fs-6">{nav.title}</Link>
                    </li>
                  )
                }
              })}
              {userID === '' ? (
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light fs-6">Login</Link>
                </li>
              ) : ( 
                  <li className="nav-item">
                    <div className="nav-link text-light fs-6 cursor-pointer d-flex align-items-center justify-content-center gap-1 flex-column" onClick={handleLogout}>Logout</div>
                  </li>
              )}
            </ul>
          </div>
        </nav>
        
        <Container className='w-100 d-flex flex-column flex-fill'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {defaultRoutes!== null && defaultRoutes.length > 0 &&  defaultRoutes?.map(route => 
              <Route key={route.id} path={`/${route.route}`} element={route.element} />
            )}
            <Route path='*' element={<Page404 />} />
          </Routes>
        </Container>
      </div >
    </Router >
  );
};

export default App;


const Page404 = () => {
  const navigate = useNavigate(); 
  return (
      <div className='d-flex align-items-center justify-content-center my-2 my-md-4 flex-column'>
          <div className='text-light my-2 my-md-4 fs-2'>404 - Page not found</div>
          <Button className='w-auto px-2 px-md-4' onClick={() => navigate('/')} type='button'>Proceed to Home Page</Button>
      </div>
  )
}