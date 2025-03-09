import GlassElement from "./GlassElement";

function GlassForm({ className, children, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <GlassElement className={className}>{children}</GlassElement>
    </form>
  );
}

export default GlassForm;
