import { Module } from "vuex";
import { RootState } from "../index";
import axios from "axios";
import router from "../../router";

export interface accountState {
  accessToken: string;
  accounts: Array<any>;
  user: any;
  //
  count: number;
}

export const accountStore: Module<accountState, RootState> = {
  namespaced: true,
  state: () => ({
    accessToken: "",
    accounts: [],
    user: {},
    count: 0,
  }),
  getters: {
    isLogin: (state) => {
      return !!state.accessToken;
    },
    getUser: (state) => {
      // return JSON.parse(atob(state.accessToken.split('.')[1])).username
      return JSON.parse(atob(state.accessToken.split(".")[1]));
    },
    //
    doubleCount: (state) => {
      return state.count * 2;
    },
  },
  mutations: {
    setToken(state, newAccessToken) {
      state.accessToken = newAccessToken;
    },
    deleteToken(state) {
      state.accessToken = "";
    },
    setAccounts(state, newAccounts) {
      state.accounts = newAccounts;
      // console.log(state.accounts)
    },
    setUser(state, user) {
      state.user = user;
      // console.log(state.accounts)
    },
    //
    increment(state) {
      state.count++;
      console.log(state.count);
    },
  },
  actions: {
    getToken({ commit }, { user_id, password }) {
      axios
        .post("http://localhost:9999/api/v1/auth/login", { user_id, password })
        .then((response) => {
          console.log(response)
          localStorage.setItem("accessToken", response.data.accessToken);
          commit("setToken", response.data.accessToken);
          router.push({ name: "About" });
        })
        .catch((err) => {
          console.log("에러", err.response);
        });
    },
    getAccounts({ commit }) {
      axios.get("http://127.0.0.1:8000/accounts/").then((response) => {
        commit("setAccounts", response.data);
      });
    },
    getUserdetail({ commit }, user_id) {
      axios
        .get(`http://127.0.0.1:8000/accounts/${user_id}/detail/`)
        .then((response) => {
          commit("setUser", response.data);
        });
    },
    //
    incrementNumber({ commit }) {
      commit("increment");
    },
  },
};
