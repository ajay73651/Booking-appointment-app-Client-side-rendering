// display user data
async function fetchAndDisplayUsers() {
  const response = await fetch("/api/get-users");
  if (response.ok) {
    const users = await response.json();
    const userList = document.getElementById("user-list");
    userList.innerHTML = ""; // Clear previous data
    users.forEach((user) => {
      const userElement = document.createElement("ul");
      userElement.innerHTML = `<li>Name: ${user.name}  Email: ${user.email}  Phone: ${user.phone}  call_date: ${user.call_date}  call_time: ${user.call_time} <button onclick="editUser(this.parentNode, ${user.id})">Edit</button>  <button onclick="deleteUser(${user.id})">Delete</button> </li>`;
      userList.appendChild(userElement);
    });
  }
}

// Handle form submission
const form = document.querySelector("form");
const submitButton = document.querySelector("button[type='submit']");
const originalButtonText = submitButton.textContent;

async function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const call_date = document.getElementById("call_date").value;
  const call_time = document.getElementById("call_time").value;

  const response = await fetch("/api/add-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phone, call_date, call_time }),
  });

  if (response.ok) {
    form.reset();
    // display user data after submission
    fetchAndDisplayUsers();
  } else {
    console.error("Failed to create user");
  }
}

form.addEventListener("submit", handleSubmit);

async function editUser(userElement, userId) {
  try {
    // Fetch user details by ID from the server
    const response = await fetch(`/api/users/${userId}`);
    if (response.ok) {
      const user = await response.json();

      // Populate the form for editing
      document.getElementById("name").value = user.name;
      document.getElementById("email").value = user.email;
      document.getElementById("phone").value = user.phone;
      document.getElementById("call_date").value = user.call_date;
      document.getElementById("call_time").value = user.call_time;

      // Add a hidden input field to store the user ID
      const userIdInput = document.createElement("input");
      userIdInput.type = "hidden";
      userIdInput.id = "user_id";
      userIdInput.name = "user_id";
      userIdInput.value = userId;
      document.querySelector("form").appendChild(userIdInput);

      // Change the text of the submit button to "Update a call"
      submitButton.textContent = "Update a call";

      // Remove previous event listener to avoid multiple listeners
      form.removeEventListener("submit", handleSubmit);

      // Add an event listener to handle the update
      form.addEventListener("submit", async function handleUpdate(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const call_date = document.getElementById("call_date").value;
        const call_time = document.getElementById("call_time").value;

        const response = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone, call_date, call_time }),
        });

        if (response.ok) {
          // Update user data in the list after editing
          userElement.innerHTML = `Name: ${name}  Email: ${email}  Phone: ${phone}  call_date: ${call_date}  call_time: ${call_time} <button onclick="editUser(this.parentNode, ${userId})">Edit</button>  <button onclick="deleteUser(${userId})">Delete</button> </li>`;
          form.reset();
          submitButton.textContent = originalButtonText; // Change button text back to original
          form.removeEventListener("submit", handleUpdate);
          form.addEventListener("submit", handleSubmit); // Add back the original event listener
        } else {
          console.error("Failed to update user");
        }
      });
    } else {
      console.error("Failed to fetch user details for editing");
    }
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/delete-user/${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      // Delete successful, update UI (re-fetch and display users)
      await fetchAndDisplayUsers();
    } else {
      console.error("Failed to delete user");
    }
  } catch (error) {
    console.error(error);
  }
}

// Fetch and display user data when the page loads
window.addEventListener("load", fetchAndDisplayUsers);
