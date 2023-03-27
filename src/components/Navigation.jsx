import { useLocation } from 'react-router-dom';


function Navigation() {
    const location = useLocation();
  
    return (
      <>
        {location.pathname === '/' && <nav><a href="/">About</a></nav>}
      </>
    );
  }
  
export default Navigation;