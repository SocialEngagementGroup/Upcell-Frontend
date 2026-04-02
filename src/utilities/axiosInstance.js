import axios from "axios";
import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/"
})

// Authentication Interceptor
axiosInstance.interceptors.request.use(async (config) => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// using cloud functions with firebase
// const axiosInstance = axios.create({
//     baseURL:"https://us-central1-global-traders-usa-84059.cloudfunctions.net/app/"
// })


// using cyclic .sh app 
// const axiosInstance = axios.create({
//     baseURL:"https://easy-erin-bluefish-wear.cyclic.app/"
// })

export default axiosInstance