// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://gacs.onrender.com";

// ------------- Auth services -----------------------
export const checkAccount = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return { response, data };
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
  const response = await fetch(`${BASE_URL}/gacs/user/userdetail/${userId}`);
  return await response.json();
}

export const editProfile = async (userId, userInfo) => {
 return await fetch(`${BASE_URL}/auth/user/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userInfo)
  });
};

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

//------------------------------ assignment endpoints -----------------------

export const getAssignmentDetail = async (assignmetnId)=>{
  const response = await fetch(`${BASE_URL}/assignment/detail/${assignmetnId}`);
  return await response.json();
}

export const getGroupAssignments = async (groupId) => {
  const response = await fetch(`${BASE_URL}/assignment/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await response.json();
};

export const createAssignment = async (newAssignment) => {
  const isFormData = newAssignment instanceof FormData;
  return await fetch(`${BASE_URL}/assignment`, {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? newAssignment : JSON.stringify(newAssignment)
  });
};

export const deleteAssignment = async (assignmentsId) => {
  return await fetch(`${BASE_URL}/assignment/${assignmentsId}`, {
    method: "DELETE"
  });
};

export const updateAssignment = async (assignmentId, updatedAssignment) => {
  if (!assignmentId) throw new Error("Assignment ID is required");
  return await fetch(`${BASE_URL}/assignment/${assignmentId}/title`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedAssignment),
  });
}

// export const updateAssignmentGuidelines = async (assignmentId, formData) => {
//   const response = await fetch(`${BASE_URL}/assignment/${assignmentId}/guidelines`, {
//     method: "PATCH",
//     body: formData
//   });
//   const data = await response.json();
//   return { response, data };
// };


//------------------------------ task endpoints -----------------------

export const createTask = async (taskDetails) => {
  return await fetch(`${BASE_URL}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskDetails)
  });
}

export const deleteTask = async (taskId) => {
  return await fetch(`${BASE_URL}/task/${taskId}`, {
    method: "DELETE"
  });
};

export const getTaskDetail = async (taskId) => {
  const response = await fetch(`${BASE_URL}/task/detail/${taskId}`);
  return await response.json();
}

export const getAssignmentTasks = async (assignmentId) => {
  const response = await fetch(`${BASE_URL}/task/${assignmentId}`);
  return await response.json();
}

export const updateTask = async (taskId, updatedTask) => {
  if (!taskId) throw new Error("Task ID is required");
  return await fetch(`${BASE_URL}/task/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTask),
  });
};

export const startTaskWork = async (taskId, userId) => {
  return await fetch(`${BASE_URL}/task/${taskId}/start-work`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
};

export const recordTimeExpiry = async (taskId, userId) => {
  return await fetch(`${BASE_URL}/task/${taskId}/record-expiry`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
};

export const submitTaskWork = async (taskId, formData) => {
  return await fetch(`${BASE_URL}/task/${taskId}/submit-work`, {
    method: "PATCH",
    body: formData
  });
};

export const verifyTaskSubmission = async (taskId, status, feedback) => {
  const response = await fetch(`${BASE_URL}/task/${taskId}/verify-submission`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, feedback })
  });
  const data = await response.json();
  return { response, data };
};

export const getAiBreakdown = async (assignmentName, assignmentDescription, memberCount, guidelinesText) => {
  const response = await fetch(`${BASE_URL}/task/breakdown/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ assignmentName, assignmentDescription, memberCount, guidelinesText })
  });
  const data = await response.json();
  return { response, data };
};


//------------------------------ notification endpoints -----------------------


export const fetchNotifications = async (groupId) => {
  const response = await fetch(`${BASE_URL}/notifications/${groupId}`);
  const data = await response.json();
  return { response, data };
};






