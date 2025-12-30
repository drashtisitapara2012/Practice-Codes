//DEMO FOR THE STATUS CODE

// function callApi(url: string) {
//   const output = document.getElementById("output")!;
//   output.textContent = "Loading...";

//   fetch(url)
//     .then(async res => {
//       let data = "";
//       try {
//         data = JSON.stringify(await res.json(), null, 2);
//       } catch {}
//       output.textContent = `Status: ${res.status}\n${data}`;
//     })
//     .catch(() => {
//       output.textContent = "Network error";
//     });
// }

// function post(url: string) {
//   const output = document.getElementById("output")!;
//   output.textContent = "Loading...";

//   fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email: "admin@test.com", password: "123" })
//   })
//     .then(async res => {
//       let data = "";
//       try {
//         data = JSON.stringify(await res.json(), null, 2);
//       } catch {}

//       output.textContent = `Status: ${res.status}\n${data}`;
//     })
//     .catch(() => {
//       output.textContent = "Network error";
//     });
// }

const messageEl = document.getElementById("message")!;
const btn = document.getElementById("otpBtn") as HTMLButtonElement;

async function sendOtp() {
  messageEl.textContent = "Sending OTP...";

  try {
    const res = await fetch("/api/otp/send", {
      method: "POST"
    });

    if (res.status === 429) {
      const data = await res.json();
      messageEl.textContent = data.message;
      startCooldown(30);
      return;
    }

    if (!res.ok) {
      throw new Error("Unexpected error");
    }

    const data = await res.json();
    messageEl.textContent = data.message;

  } catch {
    messageEl.textContent = "Network error. Please try again.";
  }
}

/* Cooldown timer (REAL UX behavior) */
function startCooldown(seconds: number) {
  btn.disabled = true;
  let remaining = seconds;

  btn.textContent = `Retry in ${remaining}s`;

  const timer = setInterval(() => {
    remaining--;
    btn.textContent = `Retry in ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(timer);
      btn.disabled = false;
      btn.textContent = "Send OTP";
      messageEl.textContent = "";
    }
  }, 1000);
}
