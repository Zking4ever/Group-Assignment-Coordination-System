import { useEffect, useState } from "react";
import { getAssignmentDetail, getAssignmentSubmissions, verifyTaskSubmission } from "../services/Service";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRedo, faTimes } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

interface Submission {
    id:string;
    taskName: string;
    report:string;
    file:string;
    date: string;
    status: string;
    submitter: string;
}

export default function Submissions() {

    //prepare an end point to get assignment submissions in here
    // and then user could see submitted one navigation


    const {assignmentId} = useParams();
    const [assignment,setAssignment] = useState(null);
    const [currentUser,setCurrentUser] = useState(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const loadData = async ()=> {

        const submission = await getAssignmentSubmissions(assignmentId);
        console.log(submission)
        setSubmissions(submission);
        
        const currentAss = await getAssignmentDetail(assignmentId);
        setAssignment(currentAss);
    }

    
    const isOwner = assignment?.creatorId === currentUser?.id;

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('currentUser') || '');
        setCurrentUser(user);
        loadData();
    },[assignmentId])

    const [selected, setSelected] = useState(null as Submission | null);
    
    const handleVerifyStatus = async (status:string) => {
        if(!selected) return;
        const feedback = prompt(`Enter feedback for ${status}:`) || "";
        try {
            const { response } = await verifyTaskSubmission(selected.id, status, feedback);
            if (response.ok) {
                toast.success(`Task ${status.toLowerCase()} successfully`);
                loadData();
            }
        } catch (err) {
            toast.error("Failed to verify submission");
        }
    };
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
                submissions?.map((sub, i) => (
                    <div key={i}
                         onClick={()=>setSelected(sub)} 
                         className="submission">
                            <span>{sub.taskName}</span><span>{sub.date}</span><span>{(sub.status == 'submitted' ? 'Pending' :sub.status)}</span><span>{sub.submitter}</span>
                    </div>
                )) : (
                    <div className="submission">
                        <span>No submissions yet.</span>
                    </div>
            ) : (
                <div className="submissionDetail">
                    <span>{selected.taskName}</span>
                    <span>{selected.report}</span>
                    {isOwner && selected.status === 'submitted' && (
                        <div className={"TaskDetailPage-verificationCard"}>
                            <h3>Verification Required</h3>
                            <p>This work was submitted by <strong>{selected.submitter}</strong>. Review the details and decide.</p>
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
                    )}
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
    
    </>
  )
}
