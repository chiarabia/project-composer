import { CombinedState, combineReducers } from "redux"
import { RESET_COMPOSER, SET_COMPOSER } from "types"
import channelReducer from "./channelReducer"
import soundReducer from "./soundReducer"
import systemReducer, { defaultState as defaultSystem } from "./systemReducer"

// const rootReducer = combineReducers({
//   system: systemReducer,
//   sound: soundReducer,
//   actuators: channelReducer
// })

// export default rootReducer

const appReducer = combineReducers({
  system: systemReducer,
  sound: soundReducer,
  actuators: channelReducer
})


const rootReducer = (state: CombinedState<any>, action: any) => {
  if (action.type === SET_COMPOSER) {
    state = action.payload
  }
  if (action.type === RESET_COMPOSER) {
    state = {
      system: defaultSystem,
      sound: [],
      actuators: []
    }
  }

  return appReducer(state, action)
}
export default rootReducer