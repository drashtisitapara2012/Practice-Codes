import useIsLargeScreen from "./useIsLargeScreen";

function LargeScreen() {
  const isLargeScreen = useIsLargeScreen();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Window Size Check</h2>

      {isLargeScreen ? (
        <p>Screen is larger than 600px</p>
      ) : (
        <p> Screen is 600px or smaller</p>
      )}
    </div>
  );
}

export default LargeScreen;
