import { createSlice } from "@reduxjs/toolkit";

const initialState: RoomState = {
  room: {
    name: "",
    roomName: "",
    roomPassword: "",
    senderId: "",
  },
  users: [],
};

type usersState = {
  name: string;
  roomPassword: string;
  senderId: string;
};
interface RoomState {
  room: {
    name: string;
    roomName: string;
    roomPassword: string;
    senderId: string;
  };
  users: usersState[];
}

const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    setUsers: (state, action) => {
      const user = action.payload;

      if (state.users.find((u) => u.name === user.name)) {
        state.users = state.users.map((u) => {
          if (u.name === user.name) {
            return user;
          }
          return u;
        });
      } else {
        state.users = [...state.users, user];
      }
    },
  },
});
export const { setRoom, setUsers } = RoomSlice.actions;
export default RoomSlice.reducer;
