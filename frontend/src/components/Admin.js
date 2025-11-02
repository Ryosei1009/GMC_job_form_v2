import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

const Admin = () => {
    const adminFeatures = [
        {
            title: 'アカウントリスト',
            description: 'ユーザーアカウントの管理・権限設定',
            href: '../accountlist/',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'ジョブデータ',
            description: '職業データの管理・統計確認',
            href: '../jobdata/',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600'
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
                        管理者ツール
                    </h1>
                    <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                        システム管理とデータ分析のための管理ツール
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {adminFeatures.map((feature, index) => (
                        <Card key={index} hover className="group">
                            <div className="text-center">
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                
                                <h3 className="text-2xl font-bold text-secondary-800 mb-3">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-secondary-600 mb-6 leading-relaxed">
                                    {feature.description}
                                </p>
                                
                                <Button 
                                    onClick={() => window.location.href = feature.href}
                                    className="w-full group-hover:shadow-elegant-lg"
                                >
                                    {feature.title}へ移動
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;