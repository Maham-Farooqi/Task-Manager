import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({ mode: "onBlur" });
    

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.username,
                    email: data.email,
                    password: data.password
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'An error occured');
            }

            const responseData = await res.json();
            console.log('Success:', responseData);

            reset();
            navigate('/')

        } catch (error) {
            console.error('Error:', error.message);
            alert(error.message);
        }
    };


    return (
        <div className="fullscreen-bg d-flex align-items-center justify-content-center vh-100">
            <div className='shadow p-4 border rounded bg-white bg-opacity-75 backdrop-blur' style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className='text-center text-primary mb-4'>Create an Account</h2>

                {isSubmitting && (
                    <div className="d-flex justify-content-center mb-3">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                )}

                <form className='w-100' onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-floating mb-3">
                        <input
                            {...register("username", { required: "This field is required" })}
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Name"
                        />
                        <label htmlFor="username"><FaUser className='me-2' />Name</label>
                        {errors.username && <div className="text-danger mt-1">{errors.username.message}</div>}
                    </div>

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

                    <div className="form-floating mb-3">
                        <input
                            {...register("cpass", {
                                required: "This field is required",
                                validate: (value) => value === watch("password") || "Passwords do not match"
                            })}
                            type="password"
                            className="form-control"
                            id="cpass"
                            placeholder="Confirm Password"
                        />
                        <label htmlFor="cpass"><FaLock className='me-2' />Confirm Password</label>
                        {errors.cpass && <div className="text-danger mt-1">{errors.cpass.message}</div>}

                    </div>

                    <input type="submit" value="Sign Up" className='btn btn-primary w-100 mt-3 shadow-sm' />
                </form>
            </div>
        </div>
    );
};

export default SignUp;
