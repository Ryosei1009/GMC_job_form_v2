import axios from 'axios';
import React, { useState } from 'react'

const EachUser = ({ user, token, jobs }) => {
  const [job, setJob] = useState("");
  const handleChangeJob = (event) => {
    const job = event.target.value;
    setJob(job);
    const formData = {
      id: user.id,
      job: job,
    }
    const updateJob = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/job/update`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
      } catch (error) {
        console.error('Error uploading data:', error);
      }
    }
    updateJob();
  }
  const [job2, setJob2] = useState("");
  const handleChangeJob2 = (event) => {
    const job2 = event.target.value;
    setJob2(job2);
    const formData = {
      id: user.id,
      job2: job2,
    }
    const updateJob = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/job2/update`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
      } catch (error) {
        console.error('Error uploading data:', error);
      }
    }
    updateJob();
  }
  const [role, setRole] = useState("");
  const handleChangeRole = (event) => {
    const role = event.target.value;
    setRole(role);
    const formData = {
      id: user.id,
      role: role,
    }
    const updateRole = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/role/update`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
      } catch (error) {
        console.error('Error uploading data:', error);
      }
    }
    updateRole();
  }
  return (
    <tr className="hover:bg-secondary-50">
      <td className="px-6 py-4 text-sm font-medium text-secondary-900">
        {user.id}
      </td>
      <td className="px-6 py-4 text-sm text-secondary-700">
        {user.username}
      </td>
      <td className="px-6 py-4 text-sm text-secondary-700">
        <select
          name="job"
          id="job"
          value={job || user.job || ""}
          className="input-elegant text-sm"
          onChange={(event) => handleChangeJob(event)}
        >
          <option value="">選択してください。</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.job_id}>
              {job.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 text-sm text-secondary-700">
        <select
          name="job2"
          id="job2"
          value={job2 || user.job2 || ""}
          className="input-elegant text-sm"
          onChange={(event) => handleChangeJob2(event)}
        >
          <option value="">選択してください。</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.job_id}>
              {job.name}
            </option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 text-sm text-secondary-700">
        <select
          name="role"
          id="role"
          value={role || user.role || ""}
          className="input-elegant text-sm"
          onChange={(event) => handleChangeRole(event)}
        >
          <option value="" disabled>
            選択してください。
          </option>
          <option value="null">Roleなし</option>
          <option value="owner">オーナー</option>
          <option value="check">オーナー兼確認者</option>
          <option value="admin">管理者</option>
        </select>
      </td>
    </tr>
  )
}

export default EachUser