function Message({ message }) {
  return (
    <p className="text-center text-lg w-[80%] my-2 mx-auto font-semibold">
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
