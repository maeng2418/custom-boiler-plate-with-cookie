import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'redux/actions/user_action';
import { withRouter } from 'react-router-dom';


const RightMenu = (props) => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const logoutHandler = () => {

        dispatch(logout())
            .then(response => {
                if (response.payload.success) {
                    localStorage.removeItem('userId');
                    props.history.push('/login');
                } else {
                    alert("로그아웃 하는데 실패했습니다.")
                }
            });
    }

    return (
        user.userData && !user.userData.isAuth ?

            <Menu mode={props.mode}>
                <Menu.Item key="mail">
                    <Link to="/login">Signin</Link>
                </Menu.Item>
                <Menu.Item key="app">
                    <Link to="/register">Signup</Link>
                </Menu.Item>
            </Menu>
            :
            <Menu mode={props.mode}>
                <Menu.Item key="logout">
                    <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
            </Menu>
    )
}

export default withRouter(RightMenu);
