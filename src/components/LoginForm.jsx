import OtpInput from 'react-otp-input';

export function LoginForm(
    {
        formik,
        isButtonDisabled,
        formatTime,
        timer,
        otp,
        setOtp,
        generateOtp
    }
) {
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                {/* Username */}
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        className="input"
                        type="text"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                    />
                    <p className="register-error">
                        {formik.touched.username && formik.errors.username}
                    </p>
                </div>

                {/* Role */}
                <div>
                    <label>Type:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                checked={formik.values.role === "admin"}
                                onChange={formik.handleChange}
                            /> Admin
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="user"
                                checked={formik.values.role === "user"}
                                onChange={formik.handleChange}
                            /> User
                        </label>
                    </div>
                    <p className="register-error">
                        {formik.touched.role && formik.errors.role}
                    </p>
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone">Mobile Number:</label>
                    <input
                        className="input"
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                    />
                    <p className="register-error">
                        {formik.touched.phone && formik.errors.phone}
                    </p>
                </div>

                {/* OTP */}
                <div>
                    {isButtonDisabled && (
                        <p style={{ marginTop: '20px', fontSize: '1rem', color: 'red' }}>
                            Resend OTP in {formatTime(timer)}
                        </p>
                    )}

                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                            width: '3rem',
                            height: '3rem',
                            margin: '0 1rem',
                            fontSize: '1.5rem',
                            borderRadius: 4,
                            border: '1px solid rgba(0,0,0,0.3)',
                        }}
                        containerStyle={{
                            justifyContent: 'center',
                            marginBottom: '20px',
                            marginTop: '20px'
                        }}
                    />
                </div>

                {/* Buttons */}
                <div className="login-btn-group">
                    <button
                        type="button"
                        onClick={generateOtp}
                        disabled={isButtonDisabled}
                        className={isButtonDisabled ? "btn-blue-disable" : "btn-blue"}
                    >
                        Generate OTP
                    </button>

                    <button type="submit" className="btn-red">
                        Login
                    </button>
                </div>
            </form>
        </>
    )
}