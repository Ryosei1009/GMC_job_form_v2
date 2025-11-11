import React, { useEffect, useState } from 'react'
import EachMaterialList from './components/EachMaterialList';
import EachCraftList from './components/EachCraftList';
import EachItemList from './components/EachItemsList';
import EachEffectList from './components/EachEffectList';
import EachAudio from './components/EachAudio';
import EachGive from './components/EachGive';
import EachImage from './components/EachImage';

const JobData = ({ userInfo, token }) => {
    const [jobs, setJobs] = useState([]);
    const [job, setJob] = useState("");
    useEffect(() => {
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
    }, [token, job]);

    return (
        <div className="flex justify-center mx-3">
            <div className="max-w-5xl w-full mb-16">
                <select
                    onChange={(event) => setJob(event.target.value)}
                    className={`w-full px-2 py-1 my-4 border-2 text-black border-gray-300 rounded-xl focus:outline-none cursor-pointer`}
                >
                    <option value="">選択してください。</option>
                    {jobs.map((job) => (
                        <option key={job.id} value={job.job_id}>{job.name}</option>
                    ))}
                </select>
                <EachMaterialList job={job} userInfo={userInfo} token={token} />
                <EachCraftList job={job} userInfo={userInfo} token={token} />
                <EachItemList job={job} userInfo={userInfo} token={token} />
                <EachEffectList job={job} userInfo={userInfo} token={token} />
                <EachImage job={job} userInfo={userInfo} token={token} />
                <EachAudio job={job} userInfo={userInfo} token={token} />
                <EachGive job={job} userInfo={userInfo} token={token} />
            </div>
        </div>
    )
}

export default JobData