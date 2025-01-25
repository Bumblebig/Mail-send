import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";

export default function Send() {
    const [link, setLink] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [senderMail, setSenderMail] = useState("");
    const [senderPwd, setSenderPwd] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [isM, setM] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async function (e) {
        e.preventDefault();
        if (loading) return;
        if (senderMail && senderPwd && link && subject && body) {
            setLoading(true);
            setError(false);
            setM(false);
            try {
                const res = await fetch("https://big-scrape.onrender.com/send-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        url: link,
                        body,
                        subject,
                        sender: senderMail,
                        auth: senderPwd
                    }),
                });

                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (error) {
                    setMessage("An unexpected error occured. Try again.");
                    console.error(error);
                    return;
                }

                if (res.ok) {
                    reset();
                    setM(true)
                    setMessage(`${data.message} to ${data.to}`);
                } else setMessage(`Error: ${data.error}`)

            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        } else alert("Fill all fields")
    }

    const reset = function () {
        setLink("");
        setBody("");
        setSubject("");
    }

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

    useEffect(() => {
        if (!user) return;

        const getUserData = async () => {
            try {
                const userDocRef = doc(db, "Users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const { sendmail, sendpwd } = userDocSnap.data();
                    setSenderMail(sendmail);
                    setSenderPwd(sendpwd);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("An error occurred. Please try again.");
            }
        };

        getUserData();
    }, [user]);

    const logout = async () => {
        try {
            await auth.signOut();
            navigate("/login"); // Ensure redirect
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="w-full h-screen flex-col bg-white flex items-center lg:justify-start lg:flex-row relative">
            <div className="absolute top-0 left-0 z-0 lg:hidden w-full">
                <nav className="text-white bg-neutral-500 h-[60px] w-full px-4 py-12 pt-20 flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold">Dev mail</h1>
                    <p className="cursor-pointer" onClick={logout}>Logout</p>
                </nav>
            </div>
            <div className="bg-neutral-500 hidden text-white items-center justify-center h-screen lg:flex w-2/5 px-8 relative">
                <div>
                    <h1 className="font-bold text-5xl leading-tight">
                        This sends mail to the app developer
                    </h1>
                    <Link to="/custom-mail" className="mt-4 block underline">
                        Don&apos;t want to send to the dev? click to send custom test mail
                    </Link>
                </div>
                <p className="cursor-pointer absolute top-5 right-5" onClick={logout}>Logout</p>
            </div>

            <Link to="/custom-mail" className="mb-8 mt-[160px] text-center w-[80%] lg:hidden cursor-pointer underline">
                Don&apos;t want to send to the dev? click to send custom test mail
            </Link>
            <div className="lg:flex lg:items-center lg:justify-center lg:h-screen lg:w-full">
                <form
                    className="w-full max-w-[500px] shadow-xl bg-gray-50 p-8 rounded flex flex-col gap-12 py-12"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="link" className="text-lg mb-3 block text-gray-950">
                            Playstore Link:
                        </label>
                        <input
                            type="text"
                            name="link"
                            placeholder="https://play.com/appname"
                            id="link"
                            required
                            className="block border-b border-neutral-500 outline-none w-full py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="subject"
                            className="text-lg mb-3 block text-gray-950"
                        >
                            Subject:
                        </label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            id="subject"
                            required
                            className="block border-b border-neutral-500 outline-none w-full py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="body"
                            className="text-lg mb-3 block text-gray-950"
                        >
                            Body:
                        </label>
                        <textarea
                            name="body"
                            placeholder="body"
                            id="body"
                            required
                            className="block border-b border-neutral-500 outline-none w-full py-2 px-4 bg-gray-50 focus:border-b-4 text-neutral-500 h-36"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        > </textarea>
                    </div>

                    <div>
                        <p className={`${!loading && 'hidden'}`}>Loading...</p>
                        <p className={`${!isError && 'hidden'}`}>An error occured</p>
                        <p className={`${!isM && 'hidden'} max-w-full`}>{message}</p>
                        <input
                            type="submit"
                            value="Send mail"
                            className={`${loading ? "cursor-not-allowed bg-neutral-300" : "cursor-pointer bg-neutral-500"} block w-full text-white mt-6 py-2`}
                        />
                    </div>
                </form>
            </div>
        </section>
    )
}