import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";

export default function Change() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [isM, setM] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login"); // Redirect if user logs out
            } else {
                setUser(user);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (email && password) {
            setLoading(true);
            setError(false);
            setM(false);
            try {
                const docRef = doc(db, "Users", user.uid);
                await updateDoc(docRef, {
                    sendmail: email,
                    sendpwd: password,
                });
                setM(true);
                setMessage("Credentials successfully updated!");
                reset();

            } catch (error) {
                console.error("Error updating document:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        } else alert("Fill all fields");
    }

    const logout = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    const reset = function () {
        setEmail("");
        setPassword("");
    }

    return (
        <section className="w-full h-screen flex-col bg-white flex items-center lg:justify-start lg:flex-row relative">
            <div className="absolute top-0 left-0 z-0 lg:hidden w-full">
                <nav className="text-white bg-neutral-500 h-[60px] w-full px-4 py-12 pt-20 flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold">Change details</h1>
                    <p className="cursor-pointer" onClick={logout}>Logout</p>
                </nav>
            </div>

            <div className="bg-neutral-500 hidden text-white items-center justify-center h-screen lg:flex w-2/5 px-8 relative">
                <div>
                    <h1 className="font-bold text-5xl leading-tight">
                        This allows to change your senders credentials
                    </h1>
                    <Link to="/send-dev" className="mt-4 block cursor-pointer underline">
                        Click to go back to send mail{" "}
                    </Link>
                </div>
                <p className="cursor-pointer absolute top-5 right-5" onClick={logout}>Logout</p>
            </div>

            <Link to="/send-dev" className="mb-8 mt-[160px] text-center w-[80%] cursor-pointer lg:hidden underline">
                Click to go back to send mail
            </Link>

            <div className="lg:flex lg:items-center lg:justify-center lg:h-auto lg:w-full w-[95%]">
                <form className="w-full max-w-[500px] shadow-xl bg-gray-50 p-8 rounded flex flex-col gap-12 py-12" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="mail" className="text-lg mb-3 block text-gray-950">
                            Sender Mail:
                        </label>
                        <input type="mail" name="mail" placeholder="abc@example.com" id="mail" required className="block border-b border-neutral-500 outline-none w-full py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="subject" className="text-lg mb-3 block text-gray-950">Sender temporary mail passoword:</label>
                        <input type="text" name="subject" placeholder="Subject" id="subject" required className="block border-b border-neutral-500 outline-none w-full py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div>
                        <p className={`${!loading && 'hidden'}`}>Loading...</p>
                        <p className={`${!isError && 'hidden'}`}>An error occured</p>
                        <p className={`${!isM && 'hidden'} w-full`}>{message}</p>
                        <input type="submit" value="Send mail" className={`${loading ? "cursor-not-allowed bg-neutral-300" : "cursor-pointer bg-neutral-500"} block w-full text-white mt-6 py-2`} />
                    </div>
                </form>
            </div>
        </section>
    );
}