import GlassElement from "./GlassElement";

// A component That is used to add the Glassy Effect to the signup/login forms.
function GlassForm({ className, children, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <GlassElement className={className}>{children}</GlassElement>
    </form>
  );
}

export default GlassForm;
