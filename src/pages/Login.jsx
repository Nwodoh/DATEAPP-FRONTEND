import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Login.module.css";
import HomeWrapper from "../components/HomeWrapper";
import GlassForm from "../components/GlassForm";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/16/solid";
import GlassCTA from "../components/GlassCTA";

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
      <section className="px-[5%] pt-[3%]">
        {type === "login" && <LoginForm />}
        {type === "forgot-password" && <ForgotPassword />}
        {type === "reset-password" && <ResetPassword />}
      </section>
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
    <div className="flex justify-center">
      <div className="w-fit">
        <GlassForm className="p-9 space-y-7" onSubmit={handleSubmit}>
          <h1 className="text-center text-3xl font-bold mt-0 mb-7">Login</h1>
          <label className="flex items-center gap-2 bg-stone-900/37 p-2 rounded-md text-white md:min-w-[360px]">
            <AtSymbolIcon className="w-4" />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="your email address"
              className="grow text-base outline-none font-medium tracking-wider"
              required
            />
          </label>
          <label className="flex items-center gap-2 bg-stone-900/37 p-2 rounded-md text-white">
            <LockClosedIcon className="w-4" />
            <input
              type="password"
              className="grow text-base outline-none font-medium tracking-wider"
              minLength={5}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <Link to="/forgot-password" className="text-white/75">
            forgot your password?
          </Link>
          <GlassCTA
            type="button"
            className="before:bg-stone-900/80 w-min mt-1.5"
          >
            Login
          </GlassCTA>
        </GlassForm>
      </div>
    </div>
    // <form className={styles.form} onSubmit={handleSubmit}>
    //   <div className={styles.row}>
    //     <label htmlFor="email">Email address</label>
    //     <input
    //       type="email"
    //       id="email"
    //       onChange={(e) => setEmail(e.target.value)}
    //       value={email}
    //       required
    //     />
    //   </div>

    //   <div className={styles.row}>
    //     <label htmlFor="password">Password</label>
    //     <input
    //       type="password"
    //       id="password"
    //       onChange={(e) => setPassword(e.target.value)}
    //       value={password}
    //       required
    //     />
    // <Link to="/forgot-password" className={styles.forgotPassLink}>
    //   forgot your password?
    // </Link>
    //   </div>
    //   <div>
    //     <Button type="primary">Login</Button>
    //   </div>
    // </form>
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
