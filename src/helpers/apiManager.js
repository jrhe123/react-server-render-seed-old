import axios from 'axios';
import Promise from 'bluebird';
import { api_key } from "../utilities/apiUrl";

export const get = (endpoint, params) => {
    
    return new Promise(function(resolve, reject){
        axios.get(endpoint, params)
            .then((response) => {
                resolve(response);     
            })
            .catch((error) => {
                reject(error); 
            })   
    });        
}

export const post = (endpoint, params) => {
    
    return new Promise(function(resolve, reject){
        axios.post(endpoint, params)
            .then((response) => {
                resolve(response);     
            })
            .catch((error) => {
                reject(error); 
            })   
    });        
}

export const opayApi = (endpoint, params, isAuth) => {
    
    return new Promise(function(resolve, reject){

        let headers = null;
        if(isAuth){
            let token = localStorage.getItem("token");
            if(!token){
                reject('Error: token does not exist');
                return;
            }
            headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': api_key,
                    'Authorization': token
                }
            };
        }else{
            headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': api_key,
                }
            };
        }
        
        axios.post(endpoint, params, headers)
            .then((response) => {
                resolve(response);     
            })
            .catch((error) => {
                reject(error); 
            })   
    });        
}


export const opayFileApi = (endpoint, params, isAuth) => {

    return new Promise(function(resolve, reject){

        let headers = null;
        if(isAuth){
            let token = localStorage.getItem("token");
            if(!token){
                reject('Error: token does not exist');
                return;
            }
            headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': api_key,
                    'Authorization': token,
                }
            };
        }else{
            headers = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'api-key': api_key,
                }
            };
        }

        axios.post(endpoint, params, headers)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            })
    });
}

export const opayCsvApi = (endpoint, params, isAuth) => {
    
    return new Promise(function(resolve, reject){

        let headers = null;
        if(isAuth){
            let token = localStorage.getItem("token");
            if(!token){
                reject('Error: token does not exist');
                return;
            }
            headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': api_key,
                    'Authorization': token
                }
            };
        }else{
            headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': api_key,
                }
            };
        }
        
        axios.post(endpoint, params, headers)
            .then((response) => {
                resolve(response);     
            })
            .catch((error) => {
                reject(error); 
            })   
    });        
}

export const opayPicApi = (endpoint, params) => {
    
    return new Promise(function(resolve, reject){

        // let headers = null;     
        let headers = {
            'Content-Type': 'application/json',
            'api-key': api_key,
        };  
        axios.get(endpoint, params, headers)
            .then((response) => {
                resolve(response);     
            })
            .catch((error) => {
                reject(error); 
            })   
    });        
}