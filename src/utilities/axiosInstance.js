import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"http://localhost:5000/"
})

// using cloud functions with firebase
// const axiosInstance = axios.create({
//     baseURL:"https://us-central1-global-traders-usa-84059.cloudfunctions.net/app/"
// })


// using cyclic .sh app 
// const axiosInstance = axios.create({
//     baseURL:"https://easy-erin-bluefish-wear.cyclic.app/"
// })

export default axiosInstance