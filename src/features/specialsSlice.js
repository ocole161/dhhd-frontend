import { createSlice, current } from "@reduxjs/toolkit";

const specialsSlice = createSlice({
    name: 'specials',
    initialState: [],
    reducers: {
        setSpecials(state, action) {
            return action.payload
        },

        addSpecial: (state, action) => {
            return [...state, action.payload]
        },

        updateSpecial(state, action) {
            const updatedSpecials = state.map((special) => {
                if (special.id === action.payload.id) {
                  return action.payload }
                else {
                  return special }
            })
            return updatedSpecials
        },

        removeSpecial (state, action) {
            console.log(current(state), action.payload)
            return state.filter((special) => special.id !== action.payload.id)
        }
    }
})

export const { setSpecials, addSpecial, updateSpecial, removeSpecial } = specialsSlice.actions;
export default specialsSlice.reducer;


// OLD METHOD

// // Action Creators


// export const createSpecials = (specials) => {
//     return {
//         type: "specials/create",
//         payload: specials,
//     }
// }

// export const addSpecial = (special) => {
//     return {
//         type: "special/add",
//         payload: special,
//     };
// }

// export const removeSpecial = (id) => {
//     return {
//         type: "special/remove",
//         payload: id,
//     }
// }

// // Reducers
// const initialState = [];

// export default function specialsReducer(state = initialState, action) {
//     switch (action.type) {
//         case "specials/create":
//             return action.payload
        
//         case "special/add":
//             return [...state, action.payload];

//         case "special/remove":
//             return state.filter((special) => special.id !== action.payload)

//         default:
//             return state;
//     }
// }