import React, {useState, useEffect, createContext, useMemo, useContext} from "react";
import {deleteRefresh, deleteToken} from "../helpers/auth";
import Axios from "axios";

const UserContext = createContext(null);

export function UserProvider(props) {
  // state section
  const [user, setUser] = useState(null);

  const logout = () => {
    deleteRefresh();
    deleteToken();
    window.location.href = '/login';
  }

  const getUser = () => {
    Axios.get('/api/users/whoiam')
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        logout();
      })
  }

  useEffect(() => {
    let unmounted = false

    if (!unmounted) getUser();

    return () => {
      unmounted = true
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({user, logout, getUser}), [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return <UserContext.Provider value={value} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be inside UserContext provider');
  }

  return context;
}
