const Loading = () => {
  return (
    <div className="w-screen fixed top-14 left-0 h-[calc(100vh-56px)] flex items-center justify-center bg-background/90 z-[99]">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
