import { useState } from "react"
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

export default function Reset() {
    const [email, setEmail] = useState("");
    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async function (e) {
        e.preventDefault();
        if (loading) return;
        if (email) {
            try {
                setLoading(true);
                setIsError(false);
                await sendPasswordResetEmail(auth, email);
                alert("Email sent!\nPlease check your inbox to reset your password.");

            } catch (error) {
                setIsError(true);
                setErrMessage("Something went wrong, please try again!");
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else alert("Please enter your login email");
    }

    return (
        <section className="w-full h-screen bg-white flex items-center justify-center lg:justify-start">
            <div className="bg-neutral-500 hidden text-white items-center justify-center h-screen lg:flex w-2/5 px-8">
                <div>
                    <h1 className="font-bold text-5xl leading-tight">
                        Reset your Password
                    </h1>
                    <p className="mt-4 block">
                        <Link to="/login" className="underline cursor-pointer">
                            Return to Login
                        </Link>
                    </p>
                </div>
            </div>

            <div className="lg:flex lg:items-center lg:justify-center lg:h-screen lg:w-full w-[95%]">
                <form
                    className="w-full max-w-[500px] shadow-xl bg-gray-50 p-8 rounded flex flex-col gap-6 py-12"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="email" className="text-lg mb-3 block text-gray-950">
                            Enter your email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="abc@example.com"
                            id="email"
                            required
                            className="block border-b border-neutral-500 outline-none w-full py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>


                    <div>
                        <p className={`${!loading && "hidden"}`}>Loading...</p>
                        <input
                            type="submit"
                            value="Reset Password"
                            className={`${loading ? "cursor-not-allowed bg-neutral-300" : "cursor-pointer bg-neutral-500"} block w-full text-white mt-6 py-2`}
                        />
                        <p
                            className={`text-red-500 text-center ${isError ? "block" : "hidden"
                                } mt-4`}
                        >
                            {errMessage}
                        </p>

                        <p className="mt-8 text-center lg:hidden">
                            <Link to="/login" className="underline cursor-pointer">
                                Return to Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    )
}