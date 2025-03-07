function HomeWrapper({
  bgImage = "/bg/pexels-fmaderebner-340566.jpg",
  children,
}) {
  return (
    <main
      className="h-svh p-4 pt-24 overflow-auto"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <section>{children}</section>
    </main>
  );
}

export default HomeWrapper;
