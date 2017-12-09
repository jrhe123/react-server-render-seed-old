import axios from 'axios';
import Promise from 'bluebird';

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
                    'Authorization': token
                }
            };
        }else{
            headers = {
                headers: {
                    'Content-Type': 'application/json'
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
                    'Authorization': token
                }
            };
        }else{
            headers = {
                headers: {
                    'Content-Type': 'multipart/form-data'
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
                    'Authorization': token
                }
            };
        }else{
            headers = {
                headers: {
                    'Content-Type': 'application/json'
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

        let headers = null;        
        axios.get(endpoint, params, headers)
            .then((response) => {
                resolve(response);     
            })
            .catch((error) => {
                reject(error); 
            })   
    });        
}