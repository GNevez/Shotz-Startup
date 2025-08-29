import { useEffect } from "react";
import axios from "axios";
import styles from "./Login.module.scss";
import { useDispatch } from "react-redux";
import { changeUser, logout } from "../redux/userSlice";

const Login = () => {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();

  async function getMe() {
    axios.get("http://localhost:1500/authentication").then((response) => {
      if (response.data) {
        const user = response.data.user;
        const id = response.data.id;

        const avatar = `https://cdn.discordapp.com/avatars/${response.data.sub}/${response.data.avatar}.png`;

        const payload = { user, id, avatar };
        dispatch(changeUser(payload));
      } else {
        dispatch(logout());
      }
    });
  }

  useEffect(() => {
    getMe();
  }, []);

  return;
};

export default Login;
