import { 
  createSlice, 
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState({
    status: 'idle',
    error: null
  }),
  reducers: {
    allNotificationsRead(state) {
      const allNotifications = Object.values(state.entities)
      const allNotificationsSetToRead = allNotifications.map(notification => ({
        ...notification,
        read: true
      }))
      notificationsAdapter.upsertMany(state, allNotificationsSetToRead)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded'

        const newNotifications = action.payload
        const newNotificationsWithReadFlag = newNotifications.map(notification => ({
          ...notification,
          read: false
        }))
        const existingNotifications = Object.values(state.entities)
        const allNotificationsWithReadFlag = existingNotifications.concat(newNotificationsWithReadFlag)
        const allNotificationsWithUpdatedIsNewAndReadFlag = allNotificationsWithReadFlag.map(notification => ({
          ...notification,
          // Any notifications we've read are no longer new
          isNew: !notification.read
        }))
        notificationsAdapter.upsertMany(state, allNotificationsWithUpdatedIsNewAndReadFlag)
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications)

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)