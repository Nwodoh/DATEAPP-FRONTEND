// This component is returned when the route was not foundin the app.

export default function PageNotFound() {
  return (
    <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
      <h1 className="text-stone-700">Page not found 😢</h1>
    </div>
  );
}
