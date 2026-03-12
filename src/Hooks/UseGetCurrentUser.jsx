import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { serverurl } from "../App";
import { setUserData } from "../pages/redux/UserSlice";

const AUTH_TOKEN_KEY = "vingo_auth_token";

const normalizeCurrentUserPayload = (payload) => {
  const rawUser = payload?.User || payload?.user;
  if (!rawUser) {
    return null;
  }

  const userId = rawUser?.id || rawUser?._id;
  if (!userId) {
    return null;
  }

  const normalizedUser = { ...rawUser, id: userId };
  return {
    ...payload,
    User: normalizedUser,
    user: normalizedUser,
  };
};

const UseGetCurrentUser = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchuser = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const result = await axios.get(`${serverurl}/user/getcurrent`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!active) {
          return;
        }

        const normalizedPayload = normalizeCurrentUserPayload(result?.data);
        if (result?.data?.success && normalizedPayload?.User?.id) {
          dispatch(setUserData(normalizedPayload));
        } else {
          dispatch(setUserData(null));
        }
      } catch (error) {
        if (!active) {
          return;
        }

        if (error?.response?.status === 401) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          dispatch(setUserData(null));
        } else {
          console.log(error?.response?.data || error.message);
          dispatch(setUserData(null));
        }
      } finally {
        if (active) {
          setAuthChecked(true);
        }
      }
    };

    fetchuser();

    return () => {
      active = false;
    };
  }, [dispatch]);

  return authChecked;
};

export default UseGetCurrentUser;
