// NOT a chat message but just an elementthat shows if haven't chatted with an person before.

function Message({ message }) {
  return (
    <p className="text-center text-lg w-[80%] my-2 mx-auto font-semibold">
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
