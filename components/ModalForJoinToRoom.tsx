import cogoToast from "cogo-toast";
import Router from "next/router";
import { useState } from "react";
import { io } from "socket.io-client";
import { setRoom, setUsers } from "../features/RoomSlice";
import { useAppDispatch } from "../store/store";

const socket = io("https://message-app-soket-io.onrender.com");

type Props = {
  setIsModalOpen: (value: boolean) => void;
};

const ModalForJoinToRoom = ({ setIsModalOpen }: Props) => {
  const [isJoinRoom, setIsJoinRoom] = useState(false);

  /* create room states */
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  /* Join room states */
  const [yourName, setYourName] = useState("");

  /* dispatch */
  const dispatch = useAppDispatch();

  /* Handle Create Room */
  const handleCreateRoom = async () => {
    if (!roomName || !roomPassword) {
      cogoToast.error("Please fill all fields");
      return;
    }
    socket.emit("createRoom", { name: yourName, roomName, roomPassword });

    socket.on("roomCreated", (data) => {
      if (data) {
        dispatch(
          setRoom({
            name: data?.name,
            roomName: data.roomName,
            roomPassword: data.roomPassword,
            senderId: data?.sender,
          })
        );
        /* set users */
        dispatch(
          setUsers({
            name: data?.name,
            roomPassword: data.roomPassword,
            senderId: data?.sender,
          })
        );

        setIsJoinRoom(true);
        /* redirect to the messages route */
        Router.push("/messages");
      }
    });
  };

  /* Handle Join Room */
  const handleJoinRoom = async () => {
    if (!roomPassword || !yourName) {
      cogoToast.error("Please fill all fields");
      return;
    }
    socket.emit("joinRoom", { name: yourName, roomPassword });

    setIsJoinRoom(true);
    /* redirect to the messages route */
    Router.push("/messages");
    /* joined room */

    socket.on("roomJoined", (data) => {
      console.log(data);
      if (data) {
        dispatch(
          setRoom({
            name: data?.name,
            roomPassword: data.roomPassword,
            senderId: data?.sender,
          })
        );
        /* set users */
        dispatch(
          setUsers({
            name: data?.name,
            roomPassword: data.roomPassword,
            senderId: data?.sender,
          })
        );
      }
    });
  };

  return (
    <div className="fixed z-10 w-full h-full left-0 top-0 grid place-items-center">
      <div
        onClick={() => setIsModalOpen(false)}
        className="overlay w-full h-full fixed bg-[#76abf069] backdrop-blur-sm left-0 top-0"
      ></div>
      <div className="modal-content bg-white p-12 border shadow sm:w-[30rem] z-50">
        <div className="flex flex-col justify-center items-center gap-3 mb-6">
          <div className="flex  justify-center items-center ">
            <button
              className={`p-3  ${
                !isJoinRoom
                  ? "bg-blue-500 text-white"
                  : "border-blue-500 border text-blue-500"
              }`}
              onClick={() => setIsJoinRoom(false)}
            >
              Create Room
            </button>
            <button
              className={`p-3  ${
                !isJoinRoom
                  ? "border-blue-500 border text-blue-500"
                  : "bg-blue-500 text-white"
              }`}
              onClick={() => setIsJoinRoom(true)}
            >
              Join Room
            </button>
          </div>
        </div>

        <div>
          <div className="modal-header mb-3">
            <h5
              className="modal-title text-2xl font-bold"
              id="exampleModalLabel"
            >
              {isJoinRoom ? "Join to room " : "Create Room"}
            </h5>
          </div>
          <div className="modal-body">
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
              {!isJoinRoom && (
                <>
                  <div className="form-group flex flex-col gap-2 w-full">
                    <label htmlFor="roomName">
                      Room name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control p-4 border border-gray-300 rounded-lg w-full"
                      id="roomName"
                      placeholder="Enter room name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="form-group flex flex-col gap-2 w-full">
                <label htmlFor="roomPassword">
                  Room ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  className="form-control p-4 border border-gray-300 rounded-lg w-full"
                  id="roomPassword"
                  placeholder="Enter room password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                />
              </div>

              <div className="form-group flex flex-col gap-2 w-full">
                {isJoinRoom ? (
                  <button
                    onClick={handleJoinRoom}
                    className="btn btn-primary w-full bg-blue-500 text-white p-4 rounded-lg"
                  >
                    Join
                  </button>
                ) : (
                  <button
                    onClick={handleCreateRoom}
                    className="bg-blue-500 p-3 rounded-lg text-white"
                  >
                    Create Room
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForJoinToRoom;
