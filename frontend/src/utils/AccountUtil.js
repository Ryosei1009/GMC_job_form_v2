import React, { useEffect, useState } from 'react'

export const CheckRole = (role) => {
    if (role === "admin") return "管理者";
    if (role === "owner") return "お店オーナー";
    if (role === "check") return "お店オーナー兼確認者";
    return "";
}

const GetJobName = ({ token, job_id, defaultJobs }) => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        if (defaultJobs) {
            setJobs(defaultJobs);
            return;
        }
        async function fetchJobs() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/job/get`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }
        fetchJobs();
    }, [job_id, token, defaultJobs]);
    return (
        <>{jobs.find((job) => job.job_id === job_id)?.name}</>
    )
}

export default GetJobName