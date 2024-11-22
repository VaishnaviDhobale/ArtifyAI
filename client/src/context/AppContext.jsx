import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const AppContext = createContext();
const AppContextProvider = (props) => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [showLogin, setShowLogin] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);
  const navigate = useNavigate()
  const loadCreditData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          token,
        },
      });

      if(data.success){
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateImage = async (prompt) => {
    try{
      const {data} = await axios.post(`${backendUrl}/api/image/generateImage`, {prompt}, {headers:{token}});
      if(data.success){
        loadCreditData();
        return data.resultImage;
      }else{
        toast.error(data.message);
        loadCreditData();
        if(data.creditBalance===0){
          navigate('/buy')
        }
      }
    }catch(error){
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  const logout =()=>{
      localStorage.removeItem('token');
      setToken('');
      setUser(null)
  }
  useEffect(()=>{
    if(token){
      loadCreditData();
    }
  },[token])
  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditData,
    logout,
    generateImage
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
