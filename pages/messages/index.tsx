import cogoToast from "cogo-toast";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { io } from "socket.io-client";
import MessageBody from "../../components/MessageBody";
import { useAppSelector } from "../../store/store";
type Props = {};
const socket = io("https://message-app-soket-io.onrender.com");

const Messages = (props: Props) => {
  const [yourName, setYourName] = useState("");
  const [isJoin, setIsJoin] = useState(false);
  const [roomId, setRoomId] = useState("");
  /* selection */
  const { room, users } = useAppSelector((state) => state.roomReducer);

  /* joined user list */
  const [joinedUserList, setJoinedUserList] = useState<any>([]);

  /* handle copy */
  const handleCopy = (e: string) => {
    navigator.clipboard.writeText(e);
  };

  /* handle join room */
  const handleJoinRoom = () => {
    if (!yourName) return cogoToast.warn("Please enter your name");
    if (!roomId) return cogoToast.warn("Please enter room id");

    if (yourName.length < 3)
      return cogoToast.warn("Name must be 3 characters long");

    if (roomId.length < 6)
      return cogoToast.warn("Room id must be 6 characters long");

    if (yourName && roomId) {
      socket.emit("join_room", { roomId, yourName });
      setIsJoin(true);
    } else {
      cogoToast.error("Please enter your name and room id", {
        position: "top-left",
      });
    }
  };

  /* handle leave room */
  const handleLeaveRoom = () => {
    socket.emit("leave_room", { roomId, yourName });
    setIsJoin(false);
  };

  useEffect(() => {
    /* create random Room ID */
    const randomRoomId = Math.random().toString(36).substring(2, 8);
    setRoomId(randomRoomId);
  }, []);

  socket.emit("get_joined_users", { roomId });

  return (
    <>
      <Head>
        <title>Messages</title>
      </Head>
      <div className="p-4 sm:p-10  sm:h-screen bg-gray-100">
        <div className="container mx-auto">
          <h1 className="text-3xl font-medium">Messages box</h1>
          <p>
            This is a simple chat app built with Next.js, Socket.io, and
            Tailwind
          </p>

          <div className="message-container my-5">
            <div className="grid grid-cols-1 sm:grid-cols-6  items-stretch gap-5">
              <div className="join-form bg-white p-5 sm:col-span-1 order-3 sm:order-1 ">
                <div className="join-form__header">
                  <h3 className="text-2xl font-medium">Join a room</h3>
                  <p className="text-gray-400">Join a room to start chatting</p>
                </div>
                <div className="join-form__body">
                  <div className="flex items-start  flex-col gap-3 ">
                    <div className="form-group flex flex-col gap-2 w-full">
                      <label htmlFor="userName">
                        Your name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control p-4 border border-gray-300 rounded-lg w-full"
                        id="userName"
                        placeholder="Enter your name"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                      />
                    </div>
                    <div className="form-group flex flex-col gap-2 w-full">
                      <label htmlFor="userName">
                        Room ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control p-4 uppercase border border-gray-300 rounded-lg w-full"
                        id="userName"
                        placeholder="Enter  Room ID "
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                      />
                    </div>
                    <div className="join-form__body__button w-full">
                      <button
                        disabled={isJoin}
                        onClick={handleJoinRoom}
                        className="bg-blue-500 text-white block w-full p-4 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                      >
                        {isJoin ? (
                          <div className="flex items-center text-blue-500">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-100"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              ></path>
                            </svg>{" "}
                            Running Room...
                          </div>
                        ) : (
                          "Join"
                        )}
                      </button>

                      {isJoin && (
                        <button
                          onClick={handleLeaveRoom}
                          className="bg-red-500 text-white block w-full p-2 rounded-lg mt-3"
                        >
                          Leave Room
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white sm:col-span-2 order-2 sm:order-2">
                <div className="room-details">
                  <h3 className="text-xl font-medium mb-3">Room Details</h3>
                  <ul className="border p-3 flex flex-col items-start gap-3">
                    <li className="flex items-center gap-2">
                      <span>Room Name</span>
                      <span className="bg-blue-100 text-blue-500 p-1 inline-block px-3 rounded-full">
                        {room?.roomName || "Live Chat"}
                      </span>
                      <span
                        onClick={() =>
                          handleCopy(room?.roomName || "Live Chat")
                        }
                        className="cursor-pointer"
                        title="Copy"
                      >
                        <BiCopy />
                      </span>
                    </li>
                    <li
                      className="flex items-center gap-2"
                      title="Share ROOM ID for Group Chat"
                    >
                      <span>Room ID</span>
                      <span className="bg-green-100 text-green-500 uppercase p-1 inline-block px-3 rounded-full">
                        {roomId}
                      </span>
                      <span
                        onClick={() => handleCopy(roomId)}
                        className="cursor-pointer"
                        title="Copy"
                      >
                        <BiCopy />
                      </span>
                      <small className="bg-sky-100 p-1 rounded-full  px-2 text-xs text-sky-500">
                        Share Room Id for Group Chat
                      </small>
                    </li>
                  </ul>
                </div>

                <div className="users mt-5 border p-4">
                  <h3 className="text-xl font-bold">Participate Users</h3>

                  {joinedUserList?.length > 0 ? (
                    <ul className="flex flex-col gap-2 my-5">
                      {joinedUserList?.map((user: any) => (
                        <li
                          key={user?.userId}
                          className="flex items-center justify-between gap-2 bg-gray-50 p-3 cursor-pointer border"
                        >
                          <div className="flex items-center gap-2">
                            <div className="avatar w-12 h-12 border rounded-full grid place-items-center font-bold">
                              {user?.yourName?.slice(0, 1)}
                            </div>

                            <div className="flex flex-col items-start">
                              <span className="text-lg font-bold">
                                {user?.yourName}
                              </span>
                              <small>{user.userId}</small>
                            </div>
                          </div>
                          {user?.senderId === room?.senderId && (
                            <span className="text-xs bg-green-100 text-green-500 p-1 px-3 rounded-full">
                              Creator
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center py-10">No user found</p>
                  )}
                </div>
              </div>

              {isJoin && (
                <MessageBody room={roomId} socket={socket} name={yourName} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
