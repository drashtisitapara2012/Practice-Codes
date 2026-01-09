//useOptimistic is used to provide instant UI updates by assuming an async action will succeed, improving user experience while automatically handling rollback if it fails.
import { useOptimistic, useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes) => currentLikes + 1
  );

  async function handleLike() {
    // 1️⃣ UI updates instantly
    addOptimisticLike();

    try {
      // 2️⃣ Server request runs in background
      await fakeApiCall();

      // 3️⃣ Real state confirmed
      setLikes((l) => l + 1);
    } catch {
      // 4️⃣ If failed → rollback automatically
    }
  }

  return <button onClick={handleLike}>👍 {optimisticLikes}</button>;
}

function fakeApiCall() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}
