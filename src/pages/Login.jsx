import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HomeWrapper from "../components/HomeWrapper";
import GlassForm from "../components/GlassForm";
import {
  AtSymbolIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/16/solid";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      if (email && password) await login(email, password);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
            isLoading={isSubmitting}
          >
            Login
          </GlassCTA>
        </GlassForm>
      </div>
    </div>
  );
}

function ForgotPassword() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("");
  const { sendOtp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!email) return;
      setIsSubmitting(true);
      await sendOtp(email, "reset_password");
      navigate("/reset-password");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-fit">
        <GlassForm className="p-9 space-y-7" onSubmit={handleSubmit}>
          <h1 className="text-center text-3xl font-bold mt-0 mb-7">
            Forgot Password
          </h1>
          <h2 className="mb-2">
            We would send a security otp to your email address
          </h2>
          <label className="flex items-center gap-2 bg-stone-900/37 p-2 rounded-md text-white">
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
          <Link to="/reset-password" className="text-white/75">
            Already have an otp? continue
          </Link>
          <GlassCTA
            type="button"
            className="before:bg-stone-900/80 w-min mt-1.5"
            isLoading={isSubmitting}
          >
            Get OTP
          </GlassCTA>
        </GlassForm>
      </div>
    </div>
  );
}

function ResetPassword() {
  // PRE-FILL FOR DEV PURPOSES
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { user, resetPassword } = useAuth();
  const email = user?.email;

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      if (!email)
        throw new Error(
          "Your email was not found, Please regenerate a new token or try loggin in again."
        );
      await resetPassword({ email, password, passwordConfirm, otp });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-fit">
        <GlassForm className="p-9 space-y-7" onSubmit={handleSubmit}>
          <h1 className="text-center text-3xl font-bold mt-0 mb-7">
            Reset Password
          </h1>
          <label className="flex items-center gap-2 bg-stone-900/37 p-2 rounded-md text-white md:min-w-[360px]">
            <ShieldCheckIcon className="w-5" />
            <input
              type="text"
              className="grow text-base outline-none font-medium tracking-wider"
              maxLength={6}
              value={otp}
              placeholder={`6 digit OTP sent to ${email}`}
              onChange={(e) => setOtp(e.target.value)}
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
          <label className="flex items-center gap-2 bg-stone-900/37 p-2 rounded-md text-white">
            <LockClosedIcon className="w-4" />
            <input
              type="password"
              className="grow text-base outline-none font-medium tracking-wider"
              minLength={5}
              placeholder="Confirm password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </label>
          <Link to="/forgot-password" className="text-white/75">
            No otp? Generate One
          </Link>
          <GlassCTA
            type="button"
            className="before:bg-stone-900/80 w-min mt-1.5"
            isLoading={isSubmitting}
          >
            Reset Password
          </GlassCTA>
        </GlassForm>
      </div>
    </div>
  );
}
