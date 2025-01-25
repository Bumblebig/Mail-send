import { createUserWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Register() {
    const [appP, setAppP] = useState("");
    const [appE, setAppE] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate();

    const getFirebaseErrorMessage = (code) => {
        switch (code) {
            case AuthErrorCodes.EMAIL_EXISTS:
                return "The email address is already in use by another account.";
            case AuthErrorCodes.INVALID_EMAIL:
                return "The email address is not valid.";
            case AuthErrorCodes.WEAK_PASSWORD:
                return "The password is too weak. Please enter a stronger password.";
            default:
                return "An unknown error occurred. Please try again.";
        }
    };

    const reset = () => {
        setAppP("");
        setAppE("");
        setEmail("");
        setPassword("");
    };

    const handleRegister = async function (e) {
        e.preventDefault();
        if (loading) return;
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;

            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    sendmail: appE,
                    sendpwd: appP,
                });
            }

            setIsError(false);
            reset();
            navigate("/custom-mail", { replace: true });
        } catch (error) {
            if ((error).code) {
                const errorMessage = getFirebaseErrorMessage(
                    (error).code
                );
                console.log(errorMessage);
                setIsError(true);
                setErrMessage(errorMessage);
            } else {
                console.log("An unknown error occurred");
                setIsError(true);
                setErrMessage("An unknown error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="w-full h-screen bg-white flex items-center justify-center lg:justify-start">
            <div className="bg-neutral-500 hidden text-white items-center justify-center h-screen lg:flex w-2/5 px-8">
                <div>
                    <h1 className="font-bold text-5xl leading-tight">
                        Register to explore now!
                    </h1>
                    <p className="mt-4 block">
                        Already have an account?{" "}
                        <Link to="/login" className="underline cursor-pointer">
                            login
                        </Link>
                    </p>
                </div>
            </div>

            <div className="lg:flex lg:items-center lg:justify-center lg:h-screen lg:w-full">
                <form
                    className="w-max shadow-xl bg-gray-50 p-8 rounded flex flex-col gap-6 py-12"
                    onSubmit={handleRegister}
                >
                    <div>
                        <label htmlFor="email" className="text-lg mb-3 block text-gray-950">
                            Login Email:
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
                        <label htmlFor="appe" className="text-lg mb-3 block text-gray-950">
                            App Email:
                        </label>
                        <input
                            type="text"
                            name="text"
                            placeholder="abc@example.com"
                            id="appe"
                            required
                            className="block border-b border-neutral-500 outline-none w-[300px] py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500"
                            value={appE}
                            onChange={(e) => setAppE(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="text-lg mb-3 block text-gray-950">
                            App password:
                        </label>
                        <input
                            type="text"
                            name="text"
                            placeholder="abc def ghi jkl"
                            id="name"
                            required
                            className="block border-b border-neutral-500 outline-none w-[300px] py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500"
                            value={appP}
                            onChange={(e) => setAppP(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="text-lg mb-3 block text-gray-950"
                        >
                            Login Password:
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
                        <p className={`${!loading && "hidden"}`}>Loading...</p>
                        <input
                            type="submit"
                            value="Register"
                            className={`${loading ? "cursor-not-allowed bg-neutral-300" : "cursor-pointer bg-neutral-500"} block w-full text-white mt-6 py-2`}
                        />
                        <p
                            className={`text-red-500 max-w-[300px] mx-auto text-center ${isError ? "block" : "hidden"
                                } mt-4`}
                        >
                            {errMessage}
                        </p>
                        <p className="mt-8 text-center lg:hidden">
                            {" "}Already have an account?{" "}
                            <Link to="/login" className="underline cursor-pointer">
                                login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    )
}