import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export default async function TreePage(props) {
  const params = await props.params;
  const { linkId } = params;

  await connectDB();

  const user = await User.findOne({ linkId });
  if (!user) return <h1 className="text-red-500">Invalid Link</h1>;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0C0F14] text-white">
        <h2 className="text-xl mb-4 text-gray-300">
          This link belongs to:{" "}
          <span className="text-purple-400">{user.email}</span>
        </h2>

        <a
          href={`/login?linkId=${user.linkId}`}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 rounded-lg transition"
        >
          Login to continue
        </a>
      </div>
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return <h1 className="text-red-500">Invalid token</h1>;
  }

  if (decoded.email !== user.email) {
    return (
      <h1 className="text-red-500 text-center mt-10 text-2xl">
        ❌ Unauthorized — This link belongs to {user.email}
      </h1>
    );
  }

  if (decoded.role === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0F14] text-white">
        <h1 className="text-2xl text-red-500">
          ❌ Admins cannot access user tree — go to{" "}
          <a href="/admin">Admin Dashboard</a>
        </h1>
      </div>
    );
  }

  const modules = [
    ...(user.allowedModules || []),
    ...(user.customModules || []),
    ...(user.links || []),
  ];

  return (
    <div
      className="
      fixed inset-0
      w-full h-full
      flex items-center justify-center
      bg-cover bg-center bg-no-repeat
      bg-fixed
      overflow-hidden
    "
      style={{
        backgroundImage: "url('/mountain.png')",
      }}
    >
      {/* OUTER BOX */}
      <div
        className="
        relative
        w-[95%] h-[95%]
        p-10 rounded-[25px]
        bg-white/5
        backdrop-blur-xl 
        border border-white/10 shadow-3xl
        flex flex-col
        items-center
        overflow-hidden
      "
      >
        <img
          src="/logo2.png"
          alt="Logo"
          className="absolute top-0 left-4 w-43 h-43 object-contain "
        />

        <div className="flex justify-center mb-0 mt-0">
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="
            w-20 h-20
            rounded-full object-cover
            border-4 border-white/40 shadow-xl
          "
          />
        </div>

        <h1
          className="
          text-2xl font-bold text-center
          text-white mb-6
          bg-gradient-to-r from-[#FFB86C] via-[#FFDCA1] to-[#FFEED1]
          bg-clip-text text-transparent
          animate-[glowPulse_3s_ease-in-out_infinite]
        "
        >
          Welcome {user.name}
        </h1>

        <style>
          {`
          @keyframes glowPulse {
            0% { opacity: 0.8; filter: drop-shadow(0 0 5px #ffcb8c); }
            50% { opacity: 1; filter: drop-shadow(0 0 15px #ffe7c0); }
            100% { opacity: 0.8; filter: drop-shadow(0 0 5px #ffcb8c); }
          }
        `}
        </style>

        <div
          className="
          flex-1
          overflow-y-auto
          w-full
          p-3 rounded-2xl
          bg-white/5
          border border-white/10
        "
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {modules.length === 0 ? (
              <p className="text-center text-gray-300 text-lg col-span-3">
                No modules assigned
              </p>
            ) : (
              modules.map((mod, index) => (
                <a
                  key={index}
                  href={mod.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  relative group 
                  w-full
                  flex items-center justify-between
                  px-5 py-3
                  rounded-full
                  border border-white
                  bg-black/20
                  overflow-hidden
                  transition-all duration-500
                "
                >
                  <span
                    className="
                    absolute right-0 top-0 h-full w-16
                    bg-gradient-to-r from-[#8F3DFF] to-[#FF4FD8]
                    transition-all duration-500
                    group-hover:w-full
                  "
                  />

                  <span className="relative z-10 text-white text-base font-semibold">
                    {mod.title}
                  </span>

                  <span
                    className="
                    relative z-10 text-xl text-white pr-3
                    transition-transform duration-500
                    group-hover:translate-x-2
                  "
                  >
                    &gt;
                  </span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
