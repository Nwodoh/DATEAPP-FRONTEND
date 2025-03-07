import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Login.module.css";
import HomeWrapper from "../components/HomeWrapper";

function Signup({ type = "signup" }) {
  return (
    <HomeWrapper bgImage="/bg/pexels-fmaderebner-340566-1.jpg">
      {type === "signup" && <SignupForm />}
      {type === "verify" && <VerificationForm />}
    </HomeWrapper>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!email) return;
      await sendOtp(email);
      navigate("./verify");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>We would send a verification to your email address</h2>
      <div className={styles.row}>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <Button type="primary">Get SIGNUP OTP</Button>
      </div>
    </form>
  );
}

function VerificationForm() {
  // PRE-FILL FOR DEV PURPOSES
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { user, signup } = useAuth();
  const email = user?.email;

  function handleSubmit(e) {
    try {
      e.preventDefault();
      signup({ email, password, passwordConfirm, otp });
      navigate("/update");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="otp">6 digit OTP sent to {email}</label>
        <input
          type="text"
          id="otp"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          minLength={5}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="password">Confirm Password</label>
        <input
          type="password"
          id="password"
          minLength={5}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          value={passwordConfirm}
        />
        <Link to="/signup" className={styles.forgotPassLink}>
          No otp? Generate One
        </Link>
      </div>
      <div>
        <Button type="primary">Sign Up</Button>
      </div>
    </form>
  );
}

export default Signup;
