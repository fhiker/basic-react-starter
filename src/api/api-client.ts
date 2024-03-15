import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://jsonplaceholder.typicode.com",
	// params: {
	//   key: 'e53bba19d7914970889f528d70c8e06d',
	// },
});

export default axiosInstance;
