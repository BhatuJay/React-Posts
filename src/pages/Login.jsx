import "./Login.css";
import { useEffect, useState } from "react";
// import OtpInput from 'react-otp-input';
import { toast } from "react-toastify";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { login } from '../features/counter/authSlice';
import { LoginForm } from "../components/LoginForm";

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [toastId, setToastId] = useState(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const generateOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    toast.info(`Your OTP is: ${newOtp}`);

    setIsButtonDisabled(true);
    const initialTime = 300;
    setTimer(initialTime);

    if (toastId) toast.dismiss(toastId);
    const newToastId = toast.info(`Resend OTP in ${formatTime(initialTime)}`, {
      autoClose: false,
    });
    setToastId(newToastId);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp && otp.length === 4) {
      // toast.success('OTP is valid!');
      if (toastId) toast.dismiss(toastId);
      return true;
    } else {
      toast.error('Invalid OTP. Please try again.');
      return false;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isButtonDisabled) {
      setIsButtonDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, isButtonDisabled]);

  useEffect(() => {
    if (toastId && timer > 0) {
      toast.update(toastId, {
        render: `Resend OTP in ${formatTime(timer)}`,
      });
    } else if (toastId && timer === 0) {
      toast.update(toastId, {
        render: "Time's up! You can generate a new OTP.",
        type: 'warning',
        autoClose: 5000,
      });
    }
  }, [timer, toastId]);

  const formik = useFormik({
    initialValues: {
      username: '',
      role: '',
      phone: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      role: Yup.string().required('Required'),
      phone: Yup.string()
        .matches(/^\d{10}$/, 'Enter a valid 10-digit number')
        .required('Required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const isOtpValid = verifyOtp();
      if (!isOtpValid) return;

      const newUser = {
        ...values,
        id: uuidv4(),
        name: values.username,
      };

      // Save full user list if needed
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Save only current user here
      // localStorage.setItem("currentUser", JSON.stringify(newUser));
      dispatch(login(newUser));

      toast.success("Logged in Successfully!");
      sessionStorage.setItem("hasVisited", "true"); // Set after login
      navigate("/");
      resetForm();
      setOtp('');
    }
  });


  return (
    <div className="login-bg">
      <div className="login">
        <h1>LOGIN</h1>
        <p className="para">Welcome back!</p>

        <LoginForm
          formik={formik}
          isButtonDisabled={isButtonDisabled}
          formatTime={formatTime}
          timer={timer}
          otp={otp}
          setOtp={setOtp}
          generateOtp={generateOtp}
        />
      </div>
    </div>
  );
}