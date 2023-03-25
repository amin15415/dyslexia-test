import { useLocation } from 'react-router-dom';


function Navigation() {
    const location = useLocation();
  
    return (
      <nav>
        {location.pathname === '/' && <a href="/">About</a>}
      </nav>
    );
  }
  
export default Navigation;