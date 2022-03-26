import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    address: "",
    isRoundActive: false,
    roundDays: "0",
    sponsorenrollment: "",
    details: {
      wallet_address: "",
      email: "abcd@gmail.com",
      fname: "Bob",
      lname: "Smith",
      website: "https://google.com",
      profile_img: null,
      description: "Hello everyone",
      _id: "",
    },
    usd: 0.0,
    installment_voting_dates: {},
    myprojects: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.address = action.payload;
      state.details.wallet_address = action.payload;
    },
    setRound: (state, action) => {
      state.isRoundActive = action.payload;
    },
    setSponsorenrollment: (state, action) => {
      state.sponsorenrollment = action.payload;
    },
    setRoundDays: (state, action) => {
      state.roundDays = action.payload;
    },
    setDetails: (state, action) => {
      state.details = action.payload;
    },
    setIVDates: (state, action) => {
      state.installment_voting_dates = action.payload;
    },
    setUSD: (state, action) => {
      state.usd = action.payload;
    },
    setMyProjects: (state, action) => {
      state.myprojects = action.payload;
    },
  },
});

export const {
  setUser,
  setRound,
  setSponsorenrollment,
  setRoundDays,
  setDetails,
  setIVDates,
  setUSD,
  setMyProjects,
} = userSlice.actions;

export default userSlice.reducer;
