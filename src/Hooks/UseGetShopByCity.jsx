import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setCurrentShops } from "../pages/redux/UserSlice";

const Usegetshopbycity = () => {
  const dispatch = useDispatch();
  const { currentcity, userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.User?.id || !currentcity) {
      dispatch(setCurrentShops([]));
      setLoading(false);
      return;
    }

    const fetchShopbycity = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${serverurl}/shop/getshopbycity/${currentcity}`,
          {
            withCredentials: true,
          }
        );
        if (result.data.success) {
          dispatch(setCurrentShops(result.data.shops));
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(setCurrentShops([]));
          setError(null);
          return;
        }
        console.log(
          "No shop found or error:",
          err?.response?.data || err.message || err?.response?.status
        );
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopbycity();
  }, [currentcity, dispatch, userData?.User?.id]);

  return { loading, error };
};

export default Usegetshopbycity;
