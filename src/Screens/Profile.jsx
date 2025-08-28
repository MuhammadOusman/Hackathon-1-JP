import React, { useEffect } from 'react';
import Navbar from '../Components/Navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../Store/SingleUserSlice/SingleUserSlice';
import UserDetails from '../Components/UserDetails/UserDetails';
import Loader from '../Components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { singleUser, isLoading, isSuccess } = useSelector(
    (state) => state.singleUserReducer
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleProfileClick = () => {
    localStorage.removeItem('uid');
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navbar handleProfileClick={handleProfileClick} text={"Logout"} />
      <div className="container mx-auto px-4 py-8 flex justify-center items-start">
        {isLoading ? (
          <div className="h-screen w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <UserDetails name={singleUser.name} uid={singleUser.uid} email={singleUser.email} />
        )}
      </div>
    </div>
  );
};

export default Profile;
