import { useEffect, useState } from "react";
import { getAssignmentDetail, getAssignmentSubmissions, getUserDetail, verifyTaskSubmission } from "../services/Service";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRedo, faTimes } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

interface Submission {
    id:string;
    taskName: string;
    report:string;
    link:string;
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
    const [selected, setSelected] = useState(null as Submission | null);
    const [submitter,setSubmitter] = useState(null);

    const isOwner = assignment?.creatorId === currentUser?.id;

    const loadData = async ()=> {
        const submission = await getAssignmentSubmissions(assignmentId);
        setSubmissions(submission);
        
        const currentAss = await getAssignmentDetail(assignmentId);
        setAssignment(currentAss);
    }

    const getSubmitter = async()=>{
        if(!selected) return;
        const user = await getUserDetail(selected.submitter);
        setSubmitter(user);
    }

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('currentUser') || '');
        setCurrentUser(user);
        loadData();
    },[assignmentId]);

     useEffect(()=>{
        getSubmitter();
    },[selected]);
    
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

    const format = (dateString)=>{

        const date = new Date(dateString);
        if (isNaN(date)) return null;

        const time = date.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
        const datePart = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    return `${time} ${datePart}`;
    }
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
                    <div style={{display:'flex',justifyContent:'end',padding:5}}><b>{submitter?.firstName+" "+submitter?.lastName}</b></div>
                    <div>
                        <b>TASK: </b><span>{selected.taskName}</span><br/>
                        <b>Submitted at: </b><span>{format(selected.date)}</span>
                    </div>
                    <b>Report</b>
                    <div style={{borderRadius:5,backgroundColor:'#d3d3d338',padding:'5px 10px',marginBottom:10}}>{(selected.report ? selected.report :'No detailed report found. Check the external link of attached files')}</div>
                    <div style={{display:'flex',justifyContent:'space-between,gap:5'}}>
                        <a target="_blank"
                            rel="stylesheet" href={(selected.link ? selected.link : '')} className={(selected.link ? 'SubmissionLink ': 'SubmissionLink disabled')}>
                            {(selected.link ? 'Visit External Resources': 'No Attached Resource')}
                        </a>
                        <a target="_blank"
                            rel="stylesheet" href={(selected.file ? selected.file : '')} className={(selected.file ? 'SubmissionLink ': 'SubmissionLink disabled')}>
                            {(selected.file ? 'Download Attached File': 'No Attached File')}
                        </a>
                    </div>
                    {isOwner && selected.status === 'submitted' && (
                        <div className={"TaskDetailPage-verificationCard"}>
                            <h3>Verification Required</h3>
                            <div className="Verification-actions">
                                <button className="Verify-accept" onClick={() => handleVerifyStatus('ACCEPTED')}>
                                    <FontAwesomeIcon icon={faCheck} /> Accept
                                </button>
                                <button className="Verify-reject" onClick={() => handleVerifyStatus('REJECTED')}>
                                    <FontAwesomeIcon icon={faTimes} /> Reject
                                </button>
                            </div>
                            <p>This work was submitted by <strong>{submitter?.firstName}</strong>. Review the details and decide.</p>
                        </div>
                    )}
                </div>
            )}
    </>
  )
}
