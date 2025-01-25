import { useState } from "react"
import { Link } from "react-router-dom";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [isError, setIsError] = useState(false);
    // const [errMessage, setErrMessage] = useState("");

    const reset = () => {
        setEmail("");
        setPassword("");
    };

    const handleSubmit = function (e) {
        e.preventDefault();
        console.log(email, password);
        window.location.href = "/custom-mail";
        reset();
    }
    return (
        <section className="w-full h-screen bg-white flex items-center justify-center lg:justify-start">
            <div className="bg-neutral-500 hidden text-white items-center justify-center h-screen lg:flex w-2/5 px-8">
                <div>
                    <h1 className="font-bold text-5xl leading-tight">
                        Login to get started!
                    </h1>
                    <p className="mt-4 block">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="underline cursor-pointer">
                            register
                        </Link>
                    </p>
                </div>
            </div>

            <div className="lg:flex lg:items-center lg:justify-center lg:h-screen lg:w-full">
                <form
                    className="w-max shadow-xl bg-gray-50 p-8 rounded flex flex-col gap-6 py-12"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="email" className="text-lg mb-3 block text-gray-950">
                            Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="abc@example.com"
                            id="email"
                            required
                            className="block border-b border-neutral-500 outline-none w-[300px] py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="text-lg mb-3 block text-gray-950"
                        >
                            Password:
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            id="password"
                            required
                            className="block border-b border-neutral-500 outline-none w-[300px] py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="submit"
                            value="Login"
                            className="cursor-pointer block w-full bg-neutral-500 text-white mt-6 py-2"
                        />
                        {/* <p
                            className={`text-red-500 text-center ${isError ? "block" : "hidden"
                                } mt-4`}
                        >
                            {errMessage}
                        </p> */}

                        <p className="mt-8 text-center lg:hidden">
                            {" "} Don&apos;t have an account?{" "}
                            <Link to="/register" className="underline cursor-pointer">
                                register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    )
}