import store from "@/store";

//ζδΉε
let user = localStorage.getItem('user');

if(user){
  user = JSON.parse(user)
  store.commit('loginModule/setUser',user)
}