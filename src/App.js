import axios from "axios";
import { Component } from "react";
import loginPic from "./login-pic.jpg";
import {jwtDecode} from 'jwt-decode';
class App extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      login: null,
      store: null,
    };
  }
  storeCollector() {
    let store = JSON.parse(localStorage.getItem("login"));
    if (store && store.login) {
      this.setState({
        login: true,
        store: store,
        decodeInfo: store.decodeInfo
      });
    }
  }
  logout() {
    localStorage.clear();
    this.setState({
      email: null,
      password: null,
      login: null,
      store: null,
    });
  }
  login() {
    axios
      .post("http://localhost:8080/api/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        localStorage.setItem(
          "login",
          JSON.stringify({
            login: true,
            token: response.data.token,
            decodeInfo : jwtDecode(response.data.token)
          })
        );
        this.storeCollector();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidMount() {
    this.storeCollector();
  }
  render() {
    return (
      <>
        <div className="App h-screen w-screen flex justify-center items-center">
          {!this.state.login ? (
            <div className="w-2/3 h-2/3 rounded-2xl shadow-2xl flex">
              <div className="h-full w-1/2">
                <img
                  src={loginPic}
                  alt="login"
                  className="w-full h-full rounded-l-2xl"
                />
              </div>
              <div className="h-full w-1/2">
                <div className="h-full w-full flex justify-evenly items-center flex-col bg-blue-500 rounded-r-2xl">
                  <h1 className="text-2xl text-white">Login Page</h1>
                  <input
                    id="em"
                    type="email"
                    className="p-3 outline-none w-2/3 rounded-lg"
                    placeholder="Email"
                    onChange={(event) => {
                      this.setState({ email: event.target.value });
                    }}
                  />
                  <input
                    type="password"
                    id="pass"
                    className="p-3 outline-none w-2/3 rounded-lg"
                    placeholder="Password"
                    onChange={(event) => {
                      this.setState({ password: event.target.value });
                    }}
                  />
                  <button
                    className="px-4 py-2 bg-white text-blue-500 rounded-full cursor-pointer"
                    onClick={() => {
                      this.login();
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-1/2 w-1/3 rounded-2xl p-4  bg-blue-600 flex gap-5 justify-around items-center flex-col">
              <h1 className="text-3xl text-white">Logged In</h1>
              <div className="flex flex-col text-white text-lg justify-center items-center">
                <span className="text-xl text-center">Role : {this.state.decodeInfo?.role}</span>
                <span className="text-xl text-center">Username : {this.state.decodeInfo?.username}</span>
                <span className="text-xl text-center">Email: {this.state.decodeInfo?.email}</span>
              </div>
              <button
                className="px-4 py-2 bg-white text-blue-600 rounded-full cursor-pointer"
                onClick={() => {
                  this.logout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </>
    );
  }
}
export default App;
