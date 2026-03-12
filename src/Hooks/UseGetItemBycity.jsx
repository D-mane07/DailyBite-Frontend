import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setCurrentitems } from "../pages/redux/UserSlice";

const Usegetitembycity = () => {
  const dispatch = useDispatch();
  const { currentcity, userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData?.User?.id || !currentcity) {
      dispatch(setCurrentitems([]));
      setLoading(false);
      return;
    }

    const fetchitembycity = async () => {
      try {
        setLoading(true);
        const result = await axios.get(
          `${serverurl}/item/getitembycity/${currentcity}`,
          {
            withCredentials: true,
          }
        );
        if (result.data.success) {
          dispatch(setCurrentitems(result.data.items));
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          dispatch(setCurrentitems([]));
          setError(null);
          return;
        }
        console.log(
          "No item found or error:",
          err?.response?.data || err.message || err?.response?.status
        );
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchitembycity();
  }, [currentcity, dispatch, userData?.User?.id]);

  return { loading, error };
};

export default Usegetitembycity;
