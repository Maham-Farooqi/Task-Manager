import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/profile');
        }
    }, [navigate]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({ mode: "onBlur" });

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'An error occurred');
            }

            const responseData = await res.json();
            localStorage.setItem('token', responseData.token);
            console.log('Success:', responseData);

            reset();
            navigate('/profile');

        } catch (error) {
            console.error('Error:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className="fullscreen-bg d-flex align-items-center justify-content-center vh-100">
            <div className='shadow p-4 border rounded bg-white bg-opacity-75 backdrop-blur' style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className='text-center text-primary mb-4'>Log In</h2>

                {isSubmitting && (
                    <div className="d-flex justify-content-center mb-3">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-floating mb-3">
                        <input
                            {...register("email", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format"
                                }
                            })}
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                        />
                        <label htmlFor="email"><FaEnvelope className='me-2' />Email</label>
                        {errors.email && <div className="text-danger mt-1">{errors.email.message}</div>}
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            {...register("password", {
                                required: "This field is required",
                                minLength: { value: 8, message: "Minimum 8 characters required" }
                            })}
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                        />
                        <label htmlFor="password"><FaLock className='me-2' />Password</label>
                        {errors.password && <div className="text-danger mt-1">{errors.password.message}</div>}
                    </div>

                    <input type="submit" value="Log in" className='btn btn-primary w-100 mt-3 shadow-sm' />
                </form>
            </div>
        </div>
    );
};

export default Login;
