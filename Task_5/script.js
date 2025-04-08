document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("applicationForm");
    const responseMessage = document.getElementById("responseMessage");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        // Collect form data
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            ID_number: document.getElementById("ID_number").value,
            phone: document.getElementById("phone").value,
            password: document.getElementById("password").value,
            confirm_password: document.getElementById("confirm_password").value
        };

        try {
            const response = await fetch("http://localhost:3000/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            responseMessage.innerText = data.message;
            responseMessage.style.color = response.ok ? "green" : "red";
        } catch (error) {
            responseMessage.innerText = "Error submitting form.";
            responseMessage.style.color = "red";
            console.error("Submission Error:", error);
        }
    });
});
