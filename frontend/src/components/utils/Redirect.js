import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = ({ newPath }) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(newPath, { replace: true });
    }, [navigate, newPath]);
    return null;
};

export default Redirect;