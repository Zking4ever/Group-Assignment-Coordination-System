import { useEffect, useState } from "react";
import { getTaskSubmissions } from "../services/Service";
import { useParams } from "react-router-dom";

interface Submission {
    taskName: string;
    date: string;
    status: string;
    submitter: string;
}
export default function Submissions() {

    //prepare an end point to get assignment submissions in here
    // and then user could see submitted one navigation


    const {taskId} = useParams();
    const [submissions, setSubmissions] = useState([
        {
            taskName:"Building the frontend UI in figma",
            date:"2024-06-01",
            status:"Accepted",
            submitter:"User A",
        },
        {
            taskName:"Drafting the first version of the project requirements and specifications document",
            date:"2024-06-02",
            status:"Rejected",
            submitter:"User B",
        },
        {
            taskName:"Implementing the backend API endpoints for user authentication and task management",
            date:"2024-06-03",
            status:"Pending",
            submitter:"User C",
        },
    ]);
    const load = async()=>{
        const submissions = await getTaskSubmissions(taskId);
        console.log(submissions);
    }

    useEffect(()=>{
        load();
    },[taskId])

    const [selected, setSelected] = useState(null as Submission | null);
    
    //     const handleVerifyStatus = async (status) => {
    //     const feedback = prompt(`Enter feedback for ${status}:`) || "";
    //     try {
    //         const { response } = await verifyTaskSubmission(taskId, status, feedback);
    //         if (response.ok) {
    //             toast.success(`Task ${status.toLowerCase()} successfully`);
    //             loadTask();
    //         }
    //     } catch (err) {
    //         toast.error("Failed to verify submission");
    //     }
    // };
  return (
    <>
        <div className="submission header">
            <button onClick={()=>setSelected(null)}>Submissions</button>
            {selected && (
               <><div>&gt; </div><button onClick={()=>setSelected(selected)}>{selected.taskName}</button></>
            )}
        </div>
        
        {   // list header, only show when no submission is selected
            selected === null ? 
            <div className="submission">
                <span> Task </span> <span>Date</span><span>Status</span><span>Contributer</span>
            </div>
            : null
        }
        {selected === null ? 
            submissions.length > 0 ?
                submissions.map((sub, i) => (
                    <div key={i}
                         onClick={()=>setSelected(sub)} 
                         className="submission">
                            <span>{sub.taskName}</span><span>{sub.date}</span><span>{sub.status}</span><span>{sub.submitter}</span>
                    </div>
                )) : (
                    <div className="submission">
                        <span>No submissions yet.</span>
                    </div>
            ) : (
                <div className="submission">
                    <span>{selected?.taskName}</span>
                </div>
            )}
        {/* {task.submissionStatus && (
        <section className={"TaskDetailPage-submissionInfo"}>
            
                <p><strong>Report:</strong> {task.submissionReport || "No report provided."}</p>
                {task.submissionLink && <p><strong>Link:</strong> <a href={task.submissionLink} target="_blank" rel="noreferrer">{task.submissionLink}</a></p>}
                {task.submissionFile && (
                    <p><strong>File:</strong> <a href={`http://localhost:5000${task.submissionFile}`} target="_blank" rel="noreferrer">Download Attachment</a></p>
                )}
        </section>
    )} */}
    {/* {isOwner && task.state === 'submitted' && (
                            <div className={"TaskDetailPage-verificationCard"}>
                                <h3>Verification Required</h3>
                                <p>This work was submitted by <strong>{task.responsibleMemberName}</strong>. Review the details and decide.</p>
                                <div className="Verification-actions">
                                    <button className="Verify-accept" onClick={() => handleVerifyStatus('ACCEPTED')}>
                                        <FontAwesomeIcon icon={faCheck} /> Accept
                                    </button>
                                    <button className="Verify-reject" onClick={() => handleVerifyStatus('REJECTED')}>
                                        <FontAwesomeIcon icon={faTimes} /> Reject
                                    </button>
                                    <button className="Verify-reassign" onClick={() => handleVerifyStatus('REASSIGNED')}>
                                        <FontAwesomeIcon icon={faRedo} /> Reassign
                                    </button>
                                </div>
                            </div>
                        )} */}
    </>
  )
}
