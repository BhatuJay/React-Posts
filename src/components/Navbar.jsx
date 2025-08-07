import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useState } from 'react';
import { Logout } from './Logout';
import { toast } from 'react-toastify';
import AvatarHover from './AvatarHover';

import { useDispatch } from 'react-redux';
import { logout } from '../features/counter/authSlice';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import reactpostslogo from '../assets/ReactPosts-logo.png'

export function Navbar() {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const location = useLocation();
    const navigate = useNavigate();
    const [openLogout, setOpenLogout] = useState(false);

    const userimg = "https://picsum.photos/300/300";

    const handleLogoutClose = () => {
        setOpenLogout(false);
    }

    const handleLogoutSubmit = () => {
        dispatch(logout());
        toast.success("Logout successfully!");
        navigate("/login");
        setOpenLogout(false);
    }

    return (
        <>
            <div className='navbar'>
                <Link to="/" className='logo'>React Posts</Link>
                <ul>
                    <li>
                        <Link to="/" className={location === "/" ? 'link-active' : 'link'}>
                            <img
                                src={reactpostslogo}
                                alt="User Avatar"
                                className='react-posts-logo'
                            />
                        </Link>
                    </li>
                </ul>
                <div className='logout'>
                    <div>
                        {isAuthenticated ? (
                            <p>Welcome, {user.username}!</p>
                        ) : (
                            <p>Please log in</p>
                        )}
                    </div>
                    <AvatarHover className="user-icon" alt="user" avatarUrl={userimg} />
                    <button onClick={() => setOpenLogout(true)} type='button' className='btn-red'>Logout</button>
                </div>
            </div>

            {createPortal(
                openLogout && <Logout handleLogoutClose={handleLogoutClose} handleLogoutSubmit={handleLogoutSubmit} />,
                document.getElementById("modal")
            )}

        </>
    )
}