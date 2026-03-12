import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setShopData } from "../pages/redux/OwnerSlice";

const UseGetCurrentShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.User?.id || userData?.User?.role !== "owner") {
      dispatch(setShopData(null));
      setLoading(false);
      setError(null);
      return;
    }

    const fetchShop = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`${serverurl}/shop/getmyshop`, {
          withCredentials: true,
        });
        dispatch(setShopData(result?.data?.shop || null));
        setError(null);
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(setShopData(null));
          setError(null);
          return;
        }
        console.log("No shop found or error:", err?.response?.data || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [dispatch, userData?.User?.id, userData?.User?.role]);

  return { loading, error };
};

export default UseGetCurrentShop;
