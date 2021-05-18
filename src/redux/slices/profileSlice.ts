import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HexString, Profile } from "../../utilities/types";

interface profileState {
  profiles: Profile[];
}

const initialState: profileState = {
  profiles: [],
};

export const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    upsertProfile: (state, action: PayloadAction<Profile>) => {
      const newProfile = action.payload;
      const oldProfile = state.profiles.find(
        (profile) => profile.socialAddress === newProfile.socialAddress
      );
      if (oldProfile)
        state.profiles.splice(state.profiles.indexOf(oldProfile), 1);
      state.profiles.push(newProfile);
      return state;
    },
    removeProfile: (state, action: PayloadAction<HexString>) => {
      const oldProfile = state.profiles.find(
        (profile) => profile.socialAddress === action.payload
      );
      if (oldProfile)
        state.profiles.splice(state.profiles.indexOf(oldProfile), 1);
      return state;
    },
  },
});
export const { upsertProfile, removeProfile } = profileSlice.actions;
export default profileSlice.reducer;