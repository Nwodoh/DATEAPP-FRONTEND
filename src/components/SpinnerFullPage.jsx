function SpinnerFullPage() {
  return (
    <div className="relative h-svh w-svw text-pink-300 text-2xl font-bold">
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-pulse">
        Loading...
      </div>
    </div>
  );
}

export default SpinnerFullPage;
