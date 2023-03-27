import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: null,
        user_type: 'visitor',
        id: null,
    },
    reducers: {
        login(state, action) {
                return {
                    username: action.payload.username,
                    user_type: action.payload.user_type,
                    id: action.payload.id,
                }
        },

        logout() {
            return {
                username: 'Visitor',
                user_type: 'visitor',
                id: null,
            }
        }
    }
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;


// OLD METHOD

// // Action Creators
// export const login = (user) => {
//     return {
//         type: "user/login",
//         payload: user,
//     }
// }

// export const logout = () => {
//     return {
//         type: "user/logout",
//     }
// }

// // Reducers
// const initialState = {
//     username: "Visitor",
//     user_type: "visitor",
// }

// export default function userReducer(state = initialState, action) {
//     switch (action.type) {
//         case "user/login":
//             return {
//                 username: action.payload.username,
//                 user_type: action.payload.user_type,
//             }

//         case "user/logout": 
//             return {
//             username: "Visitor",
//             user_type: "visitor",
//         }

//         default:
//             return state;
//     }
// }