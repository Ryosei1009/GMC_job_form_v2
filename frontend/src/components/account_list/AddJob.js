import axios from 'axios'
import React, { useState } from 'react'

const AddJob = ({ token }) => {
    const [formData, setFormData] = useState({
        job_id: "",
        name: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = () => {
        const updateJob = async () => {
          try {
            await axios.post(`${process.env.REACT_APP_API_DOMAIN}/job/upload`, formData, {
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
            setFormData({
                job_id: "",
                name: "",
            });
          } catch (error) {
            console.error('Error uploading data:', error);
          }
        }
        updateJob();
    }
    return (
        <div className="flex justify-between mx-8 mt-12 items-center">
            <div className="w-3/12 font-bold text-2xl">
                JOB追加
            </div>
            <div className="w-8/12 flex justify-end">
                <input
                    type="text"
                    className="rounded-md w-1/4 px-2 focus:outline-none"
                    name="job_id"
                    value={formData.job_id}
                    placeholder='job_id'
                    onChange={(event) => handleChange(event)}
                />
                <input
                    type="text"
                    value={formData.name}
                    placeholder='name'
                    className="rounded-md w-1/4 ml-2 px-2 focus:outline-none"
                    name="name"
                    onChange={(event) => handleChange(event)}
                />
                <button
                    className="px-6 py-2 bg-green-500 font-bold ml-4 text-white rounded-xl"
                    onClick={() => handleSubmit()}
                >
                    追加
                </button>
            </div>
        </div>
    )
}

export default AddJob