function GlassElement({ className, children, parentClassName }) {
  return (
    <div
      className={`backdrop-blur-md overflow-hidden bg-white/10 border-[0.1px] border-white/20 rounded-xl ${parentClassName}`}
    >
      <div className={`bg-[url('/bg/paper.png')] ${className}`}>{children}</div>
    </div>
  );
}

export default GlassElement;
