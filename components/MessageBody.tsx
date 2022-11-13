import cogoToast from "cogo-toast";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import { BiX } from "react-icons/bi";
import { FaEllipsisV, FaMicrophone, FaSmile } from "react-icons/fa";
import ScrollToBottom from "react-scroll-to-bottom";

type Props = {
  room: string;
  socket: any;
  name: string;
};
const MessageBody = ({ room, socket, name }: Props) => {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [messageList, setMessageList] = useState<any>([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  /* microphone */

  /* send message */
  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (!message) return cogoToast.warn("Please enter a message");
    const messageObject = {
      room,
      message,
      author: name,
      time: new Date().toLocaleTimeString(),
    };
    await socket.emit("send_message", messageObject);
    setMessageList((prev: any) => [
      ...prev,
      { ...messageObject, sender: socket.id },
    ]);
    setMessage("");
  };

  /* handle Emoji */
  const HandleOnClickEmoji = (emoji: any) => {
    setMessage((prev: any) => prev + emoji.emoji);
  };

  /* handle voice message */
  const handleVoiceMessage = () => {
    cogoToast.warn("Voice message not implemented yet");
  };

  /* handle message list */
  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      setMessageList((prev: any) => [...prev, data]);
    });
    return () => {
      socket.off("receive_message");
      setMessageList([]);
    };
  }, [socket]);

  return (
    <div className="sm:col-span-3 order-1 sm:order-3">
      <div className="message-body border shadow bg-white rounded-lg overflow-hidden">
        <div className="message-body__header flex items-center justify-between bg-gray-50 border p-4">
          <div className="message-body__header__left flex items-center gap-3">
            <div className="message-body__header__left__image">
              <div className="w-14 h-14 bg-green-100 border border-green-400 text-green-600 grid place-items-center font-bold rounded-full">
                G
              </div>
            </div>
            <div className="message-body__header__left__name">
              <h3>{"Group Live Chat"}</h3>
              <p className="text-xs text-gray-400">Active 1 hour ago</p>
            </div>
            {typing && <p className="text-xs text-gray-400">typing...</p>}
          </div>
          <div className="message-body__header__right ">
            <div className="message-body__header__right__icon cursor-pointer">
              <FaEllipsisV />
            </div>
          </div>
        </div>

        <div className="message-body__body p-3 sm:p-6 h-[35rem] overflow-y-scroll">
          {/* message pack */}
          <ScrollToBottom className="message-container ">
            <div
              className={`message-body__body__message flex items-center gap-1 receiver relative px-5 mb-3 flex-row-reverse `}
            >
              <div className="message-body__body__message__image ">
                <div
                  title={"Admin"}
                  className={`w-7 uppercase h-7 text-xs rounded-full  grid place-items-center font-bold  bg-blue-400 text-white
                       text-black"`}
                >
                  A
                </div>
              </div>

              <p
                className={`text-sm inline-block p-3 rounded-lg overflow-hidden bg-blue-400 text-white `}
              >
                Welcome to the group chat
              </p>
              <small className="ml-3">
                <span className="text-gray-400">{"Admin"}</span>
              </small>
            </div>
            {messageList?.map((e: any, ind: number) => (
              <div
                key={e.message + ind}
                className={`message-body__body__message flex items-center gap-1 receiver relative px-5 mb-3 ${
                  e.sender === socket.id ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="message-body__body__message__image ">
                  <div
                    title={e?.author}
                    className={`w-7 uppercase h-7 text-xs rounded-full  grid place-items-center font-bold  ${
                      e.sender === socket.id
                        ? "bg-blue-400 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {e.author
                      ?.split(" ")
                      .map((e: any) => e[0])
                      .join("")}
                  </div>
                </div>

                <p
                  className={`text-sm inline-block p-3 rounded-lg overflow-hidden ${
                    e.sender === socket.id
                      ? "bg-blue-400 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  {e.message}
                </p>
                <small className="ml-3">
                  <span className="text-gray-400">{e.time}</span>
                </small>
              </div>
            ))}
          </ScrollToBottom>
        </div>
        <div className="message-body__footer bg-gray-50 flex items-stretch justify-between p-3 relative">
          <div className="message-body__footer__left flex items-center gap-3 bg-white border border-r-0 px-4 rounded-l-full">
            <div
              onClick={() => setShowEmoji((state) => !state)}
              className="message-body__footer__left__icon cursor-pointer text-xl"
            >
              {showEmoji ? <BiX /> : <FaSmile />}
            </div>
            <div className="message-body__footer__left__icon  text-xl cursor-not-allowed">
              <AiOutlinePaperClip />
            </div>
          </div>
          {showEmoji && (
            <div className="absolute z-50 -top-[400px]">
              <EmojiPicker onEmojiClick={HandleOnClickEmoji} height="400px" />
            </div>
          )}

          <form
            onSubmit={sendMessage}
            className="message-body__footer__right w-full flex items-stretch "
          >
            <div className="message-body__footer__right__input w-full items-center flex relative">
              <input
                type="text"
                placeholder="Type a message"
                className="w-full border border-l-0  p-3 outline-none "
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={() => {
                  socket.emit("typing", { author: "Admin" });
                }}
                onBlur={() => setTyping(false)}
              />

              <div
                onClick={handleVoiceMessage}
                className="message-body__footer__right__input__icon absolute right-5 cursor-pointer z-20"
              >
                <FaMicrophone />
              </div>
            </div>
            <button
              disabled={room && name ? false : true}
              className="message-body__footer__right__button disabled:bg-gray-300 disabled:cursor-not-allowed bg-blue-500 grid place-items-center rounded-r-full overflow-hidden px-6 cursor-pointer"
            >
              <span className="text-xl">
                <AiOutlineSend />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageBody;
