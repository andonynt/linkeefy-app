import create from 'zustand';

const userState = create((set) => ({
  user: null,
  setUser: (userInfo) => {
    set(
      { user: { ...userInfo } }
    )
  },
  removeUser: () => {
    set({ user: null })
  },


}));


export default userState;