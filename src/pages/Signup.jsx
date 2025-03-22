import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HomeWrapper from "../components/HomeWrapper";
import GlassForm from "../components/GlassForm";
import GlassCTA from "../components/GlassCTA";
import {
  AtSymbolIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from "@heroicons/react/16/solid";

function Signup({ type = "signup" }) {
  return (
    <HomeWrapper bgImage="/bg/pexels-fmaderebner-340566-1.jpg">
      <section className="px-[5%] pt-[3%]">
        {type === "signup" && <SignupForm />}
        {type === "verify" && <VerificationForm />}
      </section>
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
    <div className="flex justify-center">
      <div className="w-fit">
        <GlassForm className="p-9 space-y-7" onSubmit={handleSubmit}>
          <h1 className="text-center text-3xl font-bold mt-0 mb-7">Signup</h1>
          <h2 className="mb-2">
            We would send a verification to your email address
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
          <GlassCTA type="button" className="before:bg-stone-900/80 w-min">
            Get signup OTP
          </GlassCTA>
        </GlassForm>
      </div>
    </div>
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

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      await signup({ email, password, passwordConfirm, otp });
      navigate("/app/profile");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-fit">
        <GlassForm className="p-9 space-y-7" onSubmit={handleSubmit}>
          <h1 className="text-center text-3xl font-bold mt-0 mb-7">
            Verify otp
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
          <Link to="/signup" className="text-white/75">
            No otp? Generate One
          </Link>
          <GlassCTA
            type="button"
            className="before:bg-stone-900/80 w-min mt-1.5"
          >
            Sign Up
          </GlassCTA>
        </GlassForm>
      </div>
    </div>
  );
}

export default Signup;
