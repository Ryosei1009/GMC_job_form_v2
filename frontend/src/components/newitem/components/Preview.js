import React from 'react'

const Preview = ({ formData, previewUrl }) => {
  return (
    <div className="flex justify-center pb-16">
      <div className="w-80 bg-inventory pb-4 pt-[8rem] pl-4 pr-[22rem] relative">
        <div className="w-[147px] h-[141.5px] m-[2px] relative border-[1px] border-black border-opacity-5 bg-item">
          <div className="max-w-full max-h-full p-[10px]">
            <img
              className="block relative mt-2 mb-0 mx-auto w-auto h-auto max-w-[92%] max-h-full"
              src={previewUrl}
              alt=""
            />
          </div>
          <div className="absolute bottom-[10px] left-[10px] text-white font-semibold">
            1x
          </div>
          <div className="absolute bottom-[10px] right-[10px] text-white">
            {formData.weight}
          </div>
          <div className="absolute top-0 text-white w-full pl-[5px] p-[2.5px] font-semibold">
            {formData.name}
          </div>
        </div>
        <div className="absolute bottom-32 right-4 min-h-12 p-5 w-60 bg-item-content text-white">
          <div className="pl-1 text-[26px] font-bold tracking-tight">
            {formData.name}
          </div>
          <div className="pl-1 text-[15px] font-semibold tracking-tight leading-[18px]">
            {formData.description}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview