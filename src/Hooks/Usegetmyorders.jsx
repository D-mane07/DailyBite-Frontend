import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setMyorders } from "../pages/redux/UserSlice";

const UseGetOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.User?.id || userData?.User?.role !== "user") {
      dispatch(setMyorders(null));
      setLoading(false);
      setError(null);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`${serverurl}/order/userorders`, {
          withCredentials: true,
        });
        dispatch(setMyorders(result?.data?.orders || []));
        setError(null);
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(setMyorders(null));
          setError(null);
          return;
        }
        console.log("No order found error:", err?.response?.data || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch, userData?.User?.id, userData?.User?.role]);

  return { loading, error };
};

export default UseGetOrders;
