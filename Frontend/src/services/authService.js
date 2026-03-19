const BASE_URL = "http://localhost:5000";

//LOGIN PAGE 
export const checkAcc = async (email, password) => {
  const response = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);

  let data = [];
  try {
    data = await response.json();
  }
  catch {
    data = [];
  }

  return { response: { ok: data.length > 0 }, data };
};


//create new group appi
export const createNewGroup = async (newGroupData) => {
  const response = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newGroupData)
  });

  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
};


//Get method for home page
export const fetchGroups = async (groupId = null) => {
  const url = groupId ? `${BASE_URL}/groups/${groupId}` : `${BASE_URL}/groups`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return { response, data };
};


// set up username
export const createUsername = async (username) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(username)
  });

  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
};


//fetch username
export const fetchUsername = async () => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  );
  const data = await response.json();

  return { response, data };
};

export const fetchUserData = async (id) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  );
  return await response.json();
}


//assignment create
export const createNewAss = async (newAssData) => {
  const response = await fetch(`${BASE_URL}/assignments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newAssData)
  });

  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
};


//fetch assignments
export const fetchAssignments = async (assignmentId = null) => {
  const url = assignmentId ? `${BASE_URL}/assignments/${assignmentId}` : `${BASE_URL}/assignments`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return { response, data };
};


// join group
export const joinGroup = async (groupId, members) => {
  const response = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ members })
  });

  const data = await response.json();
  return { response, data };
};

export const joinGroupByCode = async (inviteCode, userId) => {
  const response = await fetch(`${BASE_URL}/groups/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inviteCode, userId })
  });
  const data = await response.json();
  return { response, data };
};

export const fetchGroupMembers = async (groupId) => {
  const response = await fetch(`${BASE_URL}/groups/members/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return { response, data };
};

export const fetchUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);

  const data = await response.json();

  return { response, data };
};


//create new task
export const createNewTask = async (taskDetails) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskDetails)
  });
  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
}


export const fetchTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
}


//edit profile 
export const editProfile = async (userId, userInfo) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userInfo)
  });
  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
};


export const updateTask = async (taskId, updatedTask) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTask),
  });

  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  if (!response.ok) {
    console.warn("Task update failed", data);
  }

  return { response, data };
};


export const deleteGroup = async (groupId) => {
  const response = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: "DELETE"
  });
  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
};


export const deleteAssignment = async (assignmentsId) => {
  const response = await fetch(`${BASE_URL}/assignments/${assignmentsId}`, {
    method: "DELETE"
  });
  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
};


export const deleteTask = async (taskId) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE"
  });
  let data = {};
  try {
    data = await response.json();
  }
  catch {
    data = {};
  }

  return { response, data };
};