export async function getTs() {
  const response = await fetch(
    "https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
  );

  if (!response.ok) {
    throw new Error("Failed to get the tasks!");
  }

  const resData = await response.json();

  return resData;
}

export async function deleteTs(id) {
  const response = await fetch(
    `https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete a task!");
  }

  return;
}

export async function editTs(id, task) {
  const response = await fetch(
    `https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update a task.");
  }

  return;
}

export async function createTs(task) {
  const response = await fetch(
    "https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks.json",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add a new task!");
  }

  const resData = await response.json();

  return resData;
}
