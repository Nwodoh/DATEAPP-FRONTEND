import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Login.module.css";
import HomeWrapper from "../components/HomeWrapper";

export default function Login({ type = "login" }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <HomeWrapper bgImage="/bg/pexels-fmaderebner-340566-1.jpg">
      {type === "login" && <LoginForm />}
      {type === "forgot-password" && <ForgotPassword />}
      {type === "reset-password" && <ResetPassword />}
    </HomeWrapper>
  );
}

function LoginForm() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <Link to="/forgot-password" className={styles.forgotPassLink}>
          forgot your password?
        </Link>
      </div>
      <div>
        <Button type="primary">Login</Button>
      </div>
    </form>
  );
}

function ForgotPassword() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("");
  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!email) return;
      await sendOtp(email, "reset_password");
      navigate("/reset-password");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <Link to="/reset-password" className={styles.forgotPassLink}>
          Already have an otp? continue
        </Link>
      </div>
      <div>
        <Button type="primary">Get OTP</Button>
      </div>
    </form>
  );
}

function ResetPassword() {
  // PRE-FILL FOR DEV PURPOSES
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { user, resetPassword } = useAuth();
  const email = user?.email;

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!email)
        throw new Error(
          "Your email was not found, Please regenerate a new token or try loggin in again."
        );
      await resetPassword({ email, password, passwordConfirm, otp });
    } catch (err) {
      alert(err.message);
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
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          minLength={5}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input
          type="password"
          id="passwordConfirm"
          minLength={5}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          value={passwordConfirm}
          required
        />
        <Link to="/forgot-password" className={styles.forgotPassLink}>
          No otp? Generate One
        </Link>
      </div>
      <div>
        <Button type="primary">Reset Password</Button>
      </div>
    </form>
  );
}
