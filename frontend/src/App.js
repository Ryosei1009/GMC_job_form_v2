import React, { useEffect, useState } from 'react';
import Login from './components/utils/account/Login';
import Header from './components/utils/Header';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import NewItem from './components/newitem/NewItemV2';
import NewItemList from './components/newitem_list/NewItemList';
import NotFound from './components/utils/NotFound';
import AccountList from './components/account_list/AccountList';
import NewItemListMeta from './metadata/NewItemListMeta';
import NewItemMeta from './metadata/NewItemMeta';
import Redirect from './components/utils/Redirect';
import Loading from './components/utils/Loading';
import Forbidden from './components/utils/Forbidden';
import Footer from './components/utils/Footer';
import JobData from './components/job_data/JobData';
import Admin from './components/Admin';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState([
    {
      id: 1,
      username: "",
      role: "",
      created_at: "",
    }
  ]);

  useEffect(() => {
    async function fetchUserInfo() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/account/userinfo`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
      setLoading(false);
    }

    fetchUserInfo();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-main/60 via-main to-main/60">
      {token && userInfo ? (
        <>
          <Header setToken={setToken} token={token} userInfo={userInfo} />
          <main className="pb-16">
            <Routes>
              {(userInfo[0].role === "admin") && (
                <>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/accountlist" element={<AccountList userInfo={userInfo} token={token} />} />
                  <Route path="/jobdata" element={<JobData userInfo={userInfo} token={token} />} />
                </>
              )}
              {(userInfo[0].role === "admin" || userInfo[0].role === "owner" || userInfo[0].role === "check") ? (
                <>
                  <Route path="/newitem" element={<NewItem userInfo={userInfo} token={token} />} />
                  <Route path="/newitemlist" element={<NewItemList userInfo={userInfo} token={token} />} />
                  <Route path="/" element={<Redirect newPath={"/newitem"} />} />
                </>
              ) : (
                !loading && <Route path="*" element={<Forbidden />} />
              )}
              {!loading && <Route path="*" element={<NotFound />} />}
            </Routes>
          </main>
        </>
      ) : (
        <>
          <Login setToken={setToken} />
          <Routes>
            <Route path="*" element={<Redirect newPath={"/"} />} />
          </Routes>
        </>
      )}
      {loading && <Loading />}
      <Routes>
        <Route path="/newitem" element={<NewItemMeta />} />
        <Route path="/newitemlist" element={<NewItemListMeta />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
