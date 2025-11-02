import React from 'react'

const Logout = ({ setToken }) => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.replace("/");
    alert('Logged out successfully');
  };

  return (
    <div
      className="hover:cursor-pointer flow-root rounded-md px-2 py-1 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
      onClick={handleLogout}
    >
      <span className="flex items-center">
        <span className="text-lg max-sm:text-base font-bold text-red-600">
          ログアウト
        </span>
      </span>
    </div>
  )
}

export default Logout