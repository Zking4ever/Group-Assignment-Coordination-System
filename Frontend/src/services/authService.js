const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://gacs.onrender.com";

// ------------- Auth services -----------------------
export const checkAccount = async (email, password) => {
  return await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
};

export const createAccount = async (userData) => {
  return await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });
};

export const getUserDetail = async(userId) =>{
  const response = await fetch(`${BASE_URL}/auth/userdetail/${userId}`);
  return await response.json();
}

//------------------------------ Group endpoints -----------------------

export const createGroup = async (newGroupData) => {
  return await fetch(`${BASE_URL}/group/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newGroupData)
  });
};

export const getMyGroups = async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const response = await fetch(`${BASE_URL}/group/user/${currentUser?.id}`);
  const data = await response.json();
  return { response, data };
};

export const getGroupCreator = async (groupId) => {
  const response = await fetch(`${BASE_URL}/group/creator/${groupId}`);
  return await response.json();
}

export const getGroupDetail = async (groupId) => {
  const response = await fetch(`${BASE_URL}/group/${groupId}`);
  const data = await response.json();
  return { response, data };
};

export const getGroupMembers = async (groupId) => {
  const response = await fetch(`${BASE_URL}/group/members/${groupId}`);
  return await response.json();
};

export const joinGroupByCode = async (inviteCode, userId) => {
  const response = await fetch(`${BASE_URL}/group/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inviteCode, userId })
  });
  const data = await response.json();
  return { response, data };
};

export const deleteGroup = async (groupId) => {
 return await fetch(`${BASE_URL}/group/${groupId}`, {
            method: "DELETE"
          });
};

export const kickMember = async (groupId, userId) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const response = await fetch(`${BASE_URL}/group/${groupId}/member/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": currentUser?.id
    }
  });
  const data = await response.json();
  return { response, data };
};


//assignment create
export const createNewAss = async (newAssData) => {
  const isFormData = newAssData instanceof FormData;
  const response = await fetch(`${BASE_URL}/assignments`, {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? newAssData : JSON.stringify(newAssData)
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
  const response = await fetch(`${BASE_URL}/group/join/${groupId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ members })
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



export const getAiBreakdown = async (assignmentName, assignmentDescription, memberCount, guidelinesText) => {
  const response = await fetch(`${BASE_URL}/ai/breakdown`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ assignmentName, assignmentDescription, memberCount, guidelinesText })
  });
  const data = await response.json();
  return { response, data };
};

export const fetchNotifications = async (groupId) => {
  const response = await fetch(`${BASE_URL}/notifications/${groupId}`);
  const data = await response.json();
  return { response, data };
};

export const updateAssignmentGuidelines = async (assignmentId, formData) => {
  const response = await fetch(`${BASE_URL}/assignments/${assignmentId}/guidelines`, {
    method: "PATCH",
    body: formData
  });
  const data = await response.json();
  return { response, data };
};

export const startTaskWork = async (taskId, userId) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/start-work`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const data = await response.json();
  return { response, data };
};

export const submitTaskWork = async (taskId, formData) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/submit-work`, {
    method: "PATCH",
    body: formData
  });
  const data = await response.json();
  return { response, data };
};

export const verifyTaskSubmission = async (taskId, status, feedback) => {
  const response = await fetch(`${BASE_URL}/tasks/${taskId}/verify-submission`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, feedback })
  });
  const data = await response.json();
  return { response, data };
};