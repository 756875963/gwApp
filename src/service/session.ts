import { lSe } from '../public/localstorage';
export class Session{
   constructor(){

   }
   setSession(sessionId){
        lSe.setItem("session",{session:sessionId});
   }
   getSession(){
        return lSe.getItem("session").session;
   }
   setRole(Name){
        lSe.setItem("role",{name:Name});
   }
   getRole(){
        return lSe.getItem("role").name;
   }
   setLogin(loginid){
    lSe.setItem("login",{loginid:loginid});
    }
    getLogin(){
        return lSe.getItem("login").loginid;
    }
   
}