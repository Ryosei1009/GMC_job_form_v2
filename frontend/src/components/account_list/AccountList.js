import React, { useEffect, useState, useMemo, useCallback } from 'react';
import EachUser from './EachUser';
import AddJob from './AddJob';
import Card from '../ui/Card';
import SearchBar from '../ui/SearchBar';

const AccountList = ({ userInfo, token }) => {
    const [usersInfo, setUsersInfo] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    useEffect(() => {
        async function fetchUsersInfo() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/account/getall?role=${userInfo[0].role}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setUsersInfo(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching new item list:', error);
            }
        }

        fetchUsersInfo();
    }, [userInfo, token]);
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
      async function fetchJobs() {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/job/get?role=${userInfo[0].role}`, {
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
    }, [userInfo, token]);

    // フィルタリング機能
    const filteredUsers = useMemo(() => {
        return usersInfo.filter(user => {
            const matchesSearch = !searchTerm || 
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toString().includes(searchTerm);
            
            const matchesRole = !roleFilter || user.role === roleFilter;
            
            return matchesSearch && matchesRole;
        });
    }, [usersInfo, searchTerm, roleFilter]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    const roles = [
        { value: "", label: "すべての権限" },
        { value: "admin", label: "管理者" },
        { value: "owner", label: "オーナー" },
        { value: "check", label: "チェッカー" },
        { value: "user", label: "一般ユーザー" }
    ];

    return (
        <div className="min-h-screen">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
                        アカウントリスト
                    </h1>
                    <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                        ユーザーアカウントの管理と権限設定
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* フィルター・検索エリア */}
                <Card className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <SearchBar 
                                onSearch={handleSearch}
                                placeholder="ユーザー名またはIDで検索..."
                            />
                        </div>
                        <div className="space-y-2">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="input-elegant"
                            >
                                {roles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* 結果表示 */}
                <div className="mb-6">
                    <p className="text-sm text-secondary-600">
                        {filteredUsers.length} 件のユーザー
                    </p>
                </div>

                {/* ユーザーリスト */}
                <Card padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-50 border-b border-secondary-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700 w-20">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">
                                        ユーザー名
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">
                                        JOB
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">
                                        JOB2
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-700">
                                        権限
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-secondary-500">
                                                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="text-lg font-medium text-secondary-700">ユーザーが見つかりません</p>
                                                <p className="text-secondary-500">条件に一致するユーザーがいません</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <EachUser key={user.id} user={user} token={token} jobs={jobs} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>


                {/* 職業追加セクション */}
                <div className="mt-12">
                    <Card>
                        <Card.Header>
                            <Card.Title>職業管理</Card.Title>
                        </Card.Header>
                        <AddJob token={token} />
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AccountList