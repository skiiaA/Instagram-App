import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'


// combine reducers : https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#combinereducers
const Reducers = combineReducers({
    // Defined a top-level state field named `userState`, handled by `user - Reducer`
    userState: user,
    usersState: users
})

export default Reducers