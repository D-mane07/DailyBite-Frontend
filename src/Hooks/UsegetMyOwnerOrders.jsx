import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setownerorders } from "../pages/redux/OwnerSlice";

const UseGetownerOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.User?.id || userData?.User?.role !== "owner") {
      dispatch(setownerorders(null));
      setLoading(false);
      return;
    }

    const fetchownerorders = async () => {
      try {
        setLoading(true);
        const result = await axios.get(`${serverurl}/order/ownerorders`, {
          withCredentials: true,
        });

        dispatch(setownerorders(result?.data?.orders || []));
        setError(null);
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(setownerorders(null));
          setError(null);
          return;
        }
        console.log("No owner order found error:", err?.response?.data || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchownerorders();
  }, [dispatch, userData?.User?.id, userData?.User?.role]);

  return { loading, error };
};

export default UseGetownerOrders;
