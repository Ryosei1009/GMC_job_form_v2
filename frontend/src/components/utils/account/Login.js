import { useState, useEffect, Fragment, useCallback } from "react"
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react"
import clsx from "clsx"
import axios from "axios"
import { Helmet } from "react-helmet"
import ActionPerfect from "../ActionPerfect"

export default function Component({ setToken }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [isPerfect, setIsPerfect] = useState(false)
    const [perfectText, setPerfectText] = useState("")

    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/login`, {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setIsPerfect(true);
            setPerfectText("ログインに成功しました。");
        } catch (error) {
            console.error(error);
            setIsError(true);
            setErrorText("ログインに失敗しました。");
        }
    };

    const handleSignup = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_DOMAIN}/account/signup`, {
                username,
                password,
            });
            setIsPerfect(true);
            setPerfectText("ユーザーが正常に登録されました。");
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 500) {
                    setIsError(true);
                    setErrorText("エラーが発生しました。ユーザーネームやパスワードを変更して再度お試しください。");
                }
                if (error.response.status === 400) {
                    setIsError(true);
                    setErrorText("ユーザーネームが既に存在しています。変更してください。");
                }
            }
        }
    };

    const validatePasswords = useCallback(() => {
        if (password !== confirmPassword) {
            setPasswordError("パスワードが一致しません")
        } else {
            setPasswordError("")
        }
    }, [password, confirmPassword])

    useEffect(() => {
        if (password && confirmPassword) validatePasswords()
    }, [password, confirmPassword, validatePasswords])

    return (
        <>
            <Helmet
                title="Login - GMC Role Play - GTA5 RPサーバー"
            />
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="card-elegant p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                                GMC JobForm
                            </h1>
                            <p className="text-secondary-600 mt-2">アカウントにサインインしてください</p>
                        </div>

                        <TabGroup>
                            <TabList className="flex w-full bg-secondary-100 rounded-lg p-1 mb-8">
                                {["ログイン", "サインアップ"].map((label, index) => (
                                    <Tab as={Fragment} key={index}>
                                        {({ selected }) => (
                                            <button
                                                className={clsx(
                                                    "flex-1 py-2.5 text-center outline-none rounded-md font-medium transition-all duration-200",
                                                    selected
                                                        ? "bg-white text-primary-600 shadow-sm"
                                                        : "text-secondary-500 hover:text-secondary-700"
                                                )}
                                            >
                                                {label}
                                            </button>
                                        )}
                                    </Tab>
                                ))}
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="username" className="block text-sm font-medium text-secondary-700">
                                                ユーザーネーム
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="input-elegant"
                                                placeholder="ユーザーネームを入力"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                                                パスワード
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input-elegant"
                                                placeholder="パスワードを入力"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`btn-primary w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    ログイン中...
                                                </div>
                                            ) : (
                                                "ログイン"
                                            )}
                                        </button>
                                    </form>
                                </TabPanel>

                                <TabPanel>
                                    <form onSubmit={handleSignup} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="signup-username" className="block text-sm font-medium text-secondary-700">
                                                ユーザーネーム
                                            </label>
                                            <input
                                                id="signup-username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="input-elegant"
                                                placeholder="ユーザーネームを入力"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="signup-password" className="block text-sm font-medium text-secondary-700">
                                                パスワード
                                            </label>
                                            <input
                                                id="signup-password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input-elegant"
                                                placeholder="パスワードを入力"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary-700">
                                                パスワード（確認）
                                            </label>
                                            <input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`input-elegant ${passwordError ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                                                placeholder="パスワードを再入力"
                                                required
                                                aria-invalid={!!passwordError}
                                                aria-describedby={passwordError ? "confirm-password-error" : undefined}
                                            />
                                            {passwordError && (
                                                <p id="confirm-password-error" className="text-error-500 text-sm mt-1">
                                                    {passwordError}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading || !!passwordError}
                                            className={`btn-primary w-full ${(loading || !!passwordError) ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    登録中...
                                                </div>
                                            ) : (
                                                "サインアップ"
                                            )}
                                        </button>
                                    </form>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </div>
                </div>
            </div>
            <ActionPerfect
                Perfect={isPerfect}
                onClose={() => {
                    setIsPerfect(false)
                    setLoading(false)
                }}
                title={"Perfect"}
                text={perfectText}
            />
            <ActionPerfect
                Perfect={isError}
                onClose={() => {
                    setIsError(false)
                    setLoading(false)
                }}
                title={"Error"} 
                text={errorText}
            />
        </>
    )
}
