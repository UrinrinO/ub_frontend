import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category, WeekReport } from "../pages/tracker/tracker.types";

type UiStatus = "IDLE" | "ACTIVE" | "PAUSED";

interface TrackerState {
  status: UiStatus;
  activeCategory: Category | null;
  seconds: number;
  showClockOutForm: boolean;
  loading: boolean;
  week: WeekReport | null;
}

const initialState: TrackerState = {
  status: "IDLE",
  activeCategory: null,
  seconds: 0,
  showClockOutForm: false,
  loading: true,
  week: null,
};

const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {
    sessionLoaded(
      state,
      action: PayloadAction<{
        status: UiStatus;
        category: Category;
        seconds: number;
      } | null>,
    ) {
      state.loading = false;
      if (action.payload) {
        state.status = action.payload.status;
        state.activeCategory = action.payload.category;
        state.seconds = action.payload.seconds;
      }
    },
    clockedIn(state, action: PayloadAction<Category>) {
      state.status = "ACTIVE";
      state.activeCategory = action.payload;
      state.seconds = 0;
    },
    paused(state) {
      state.status = "PAUSED";
    },
    clockOutOpened(state) {
      state.status = "PAUSED";
      state.showClockOutForm = true;
    },
    resumed(state) {
      state.status = "ACTIVE";
      state.showClockOutForm = false;
    },
    clockOutFormClosed(state) {
      state.showClockOutForm = false;
    },
    tickSecond(state) {
      state.seconds += 1;
    },
    reset(state) {
      state.status = "IDLE";
      state.activeCategory = null;
      state.seconds = 0;
      state.showClockOutForm = false;
    },
    weekLoaded(state, action: PayloadAction<WeekReport>) {
      state.week = action.payload;
    },
  },
});

export const {
  sessionLoaded,
  clockedIn,
  paused,
  clockOutOpened,
  resumed,
  clockOutFormClosed,
  tickSecond,
  reset,
  weekLoaded,
} = trackerSlice.actions;

export default trackerSlice.reducer;
