

import React, { useEffect } from 'react';
import axiosInstance from './axios';
import { Navigate } from 'react-router-dom';

export default function Logout() {
	useEffect(() => {
	
		localStorage.clear()
		axiosInstance.defaults.headers['Authorization'] = null;
		window.location.reload(false)
		Navigate('');
		
	});
	return (<div>Logout</div>);
}